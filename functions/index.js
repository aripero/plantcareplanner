const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure email transporter
// You'll need to set up email credentials in Firebase config
// For production, use SendGrid, Resend, Mailgun, or similar service
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change this to your email service
  auth: {
    user: functions.config().email?.user || process.env.EMAIL_USER,
    pass: functions.config().email?.password || process.env.EMAIL_PASSWORD,
  },
});

// Scheduled function to send daily digest emails
exports.sendDailyDigest = functions.pubsub
  .schedule('0 9 * * *') // Run daily at 9 AM
  .timeZone('America/New_York') // Adjust to your timezone
  .onRun(async (context) => {
    const db = admin.firestore();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      // Get all users with email notifications enabled
      const usersSnapshot = await db.collection('users')
        .where('settings.emailNotifications', '==', true)
        .where('settings.dailyDigest', '==', true)
        .get();

      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data();
        const userId = userDoc.id;

        // Get tasks due today
        const tasksSnapshot = await db.collection('tasks')
          .where('userId', '==', userId)
          .where('completed', '==', false)
          .where('date', '>=', admin.firestore.Timestamp.fromDate(today))
          .where('date', '<', admin.firestore.Timestamp.fromDate(tomorrow))
          .get();

        if (tasksSnapshot.empty) continue;

        const tasks = [];
        tasksSnapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() });
        });

        // Get user's email from auth
        const userRecord = await admin.auth().getUser(userId);
        const userEmail = userRecord.email;

        if (!userEmail) continue;

        // Build email content
        const taskList = tasks.map(task => {
          const taskDate = task.date.toDate();
          return `- ${getTaskLabel(task.type)} for ${task.plantName} (${taskDate.toLocaleDateString()})`;
        }).join('\n');

        const mailOptions = {
          from: functions.config().email?.user || process.env.EMAIL_USER,
          to: userEmail,
          subject: `PlantCarePlanner: ${tasks.length} Task(s) Due Today`,
          html: `
            <h2>Your Plant Care Tasks for Today</h2>
            <p>You have ${tasks.length} task(s) scheduled for today:</p>
            <ul>
              ${tasks.map(task => `<li><strong>${getTaskLabel(task.type)}</strong> - ${task.plantName}</li>`).join('')}
            </ul>
            <p>Visit your <a href="https://yourusername.github.io/PlantCarePlanner/calendar">calendar</a> to mark tasks as complete.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">You're receiving this because you have email notifications enabled in PlantCarePlanner.</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Daily digest sent to ${userEmail}`);
      }

      return null;
    } catch (error) {
      console.error('Error sending daily digest:', error);
      return null;
    }
  });

// Function to send individual task emails
exports.sendTaskReminder = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snap, context) => {
    const task = snap.data();
    const taskDate = task.date.toDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Only send if task is due today
    if (taskDate.getTime() !== today.getTime()) {
      return null;
    }

    try {
      // Get user settings
      const userDoc = await admin.firestore().collection('users').doc(task.userId).get();
      if (!userDoc.exists) return null;

      const user = userDoc.data();
      if (!user.settings?.emailNotifications || !user.settings?.individualEmails) {
        return null;
      }

      // Get user email
      const userRecord = await admin.auth().getUser(task.userId);
      const userEmail = userRecord.email;

      if (!userEmail) return null;

      const mailOptions = {
        from: functions.config().email?.user || process.env.EMAIL_USER,
        to: userEmail,
        subject: `PlantCarePlanner: ${getTaskLabel(task.type)} - ${task.plantName}`,
        html: `
          <h2>Plant Care Reminder</h2>
          <p>It's time to <strong>${getTaskLabel(task.type)}</strong> your <strong>${task.plantName}</strong>!</p>
          <p>Visit your <a href="https://yourusername.github.io/PlantCarePlanner/calendar">calendar</a> to mark this task as complete.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">You're receiving this because you have individual email notifications enabled.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Task reminder sent to ${userEmail}`);
      return null;
    } catch (error) {
      console.error('Error sending task reminder:', error);
      return null;
    }
  });

// Helper function to get task label
function getTaskLabel(taskType) {
  const labels = {
    watering: 'Water',
    fertilizing: 'Fertilize',
    pruning: 'Prune',
    repotting: 'Repot',
    misting: 'Mist',
    light_rotation: 'Rotate for Light',
    pest_check: 'Pest Check',
  };
  return labels[taskType] || taskType;
}

