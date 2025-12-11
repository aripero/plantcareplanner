import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';
import { format, startOfDay, isBefore, isToday } from 'date-fns';
import { Calendar, AlertCircle, CheckCircle2, Flower2, TrendingUp } from 'lucide-react';
import { getTaskLabel } from '../utils/plantData';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPlants: 0,
    upcomingTasks: 0,
    overdueTasks: 0,
    completedToday: 0,
  });
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // Get user's plants
      const plantsRef = collection(db, 'userPlants');
      const plantsQuery = query(plantsRef, where('userId', '==', userId));
      const plantsSnapshot = await getDocs(plantsQuery);
      const totalPlants = plantsSnapshot.size;

      // Get tasks
      const tasksRef = collection(db, 'tasks');
      const today = startOfDay(new Date());
      
      const upcomingQuery = query(
        tasksRef,
        where('userId', '==', userId),
        where('completed', '==', false),
        orderBy('date', 'asc'),
        limit(10)
      );
      
      const tasksSnapshot = await getDocs(upcomingQuery);
      const tasks = [];
      let overdueCount = 0;
      let completedTodayCount = 0;

      tasksSnapshot.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() };
        const taskDate = task.date.toDate();
        
        if (isBefore(taskDate, today)) {
          overdueCount++;
        } else {
          tasks.push(task);
        }
        
        if (task.completed && isToday(taskDate)) {
          completedTodayCount++;
        }
      });

      setStats({
        totalPlants,
        upcomingTasks: tasks.length,
        overdueTasks: overdueCount,
        completedToday: completedTodayCount,
      });
      
      setUpcomingTasks(tasks.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon plants">
            <Flower2 size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalPlants}</h3>
            <p>Total Plants</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon upcoming">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.upcomingTasks}</h3>
            <p>Upcoming Tasks</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon overdue">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.overdueTasks}</h3>
            <p>Overdue Tasks</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.completedToday}</h3>
            <p>Completed Today</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="upcoming-tasks-section">
          <h2>Upcoming Tasks</h2>
          {upcomingTasks.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming tasks. Add some plants to get started!</p>
            </div>
          ) : (
            <div className="tasks-list">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <span className="task-type">{getTaskLabel(task.type)}</span>
                    <span className="task-plant">{task.plantName}</span>
                  </div>
                  <span className="task-date">
                    {format(task.date.toDate(), 'MMM d, yyyy')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

