import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Mail, Bell, Save } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    dailyDigest: true,
    individualEmails: false,
    notificationTime: '09:00',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.settings) {
          setSettings({ ...settings, ...userData.settings });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await updateDoc(doc(db, 'users', userId), {
        settings,
        updatedAt: new Date(),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setSaving(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your notification preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <div className="section-header">
            <Mail size={24} />
            <h2>Email Notifications</h2>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Enable Email Notifications</label>
              <p>Receive email reminders for plant care tasks</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>

          {settings.emailNotifications && (
            <>
              <div className="setting-item">
                <div className="setting-info">
                  <label>Daily Digest</label>
                  <p>Receive one email per day with all tasks</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.dailyDigest}
                    onChange={(e) => setSettings({ ...settings, dailyDigest: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label>Individual Task Emails</label>
                  <p>Receive separate email for each task</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.individualEmails}
                    onChange={(e) => setSettings({ ...settings, individualEmails: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label>Notification Time</label>
                  <p>Time to send daily digest emails</p>
                </div>
                <input
                  type="time"
                  value={settings.notificationTime}
                  onChange={(e) => setSettings({ ...settings, notificationTime: e.target.value })}
                  className="time-input"
                />
              </div>
            </>
          )}
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Bell size={24} />
            <h2>About</h2>
          </div>
          <div className="about-content">
            <p>
              PlantCarePlanner helps you keep your plants healthy through automated care schedules and reminders.
            </p>
            <p>
              Email notifications are sent via Firebase Functions. Make sure your email is verified in your Firebase account.
            </p>
          </div>
        </div>

        <div className="settings-actions">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`save-settings-btn ${saved ? 'saved' : ''}`}
          >
            <Save size={18} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

