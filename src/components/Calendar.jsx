import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { getTaskLabel, TASK_TYPES } from '../utils/plantData';
import { getNextTaskDate } from '../utils/taskScheduler';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadTasks();
  }, [currentDate]);

  const loadTasks = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      const allTasks = [];
      
      snapshot.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() };
        const taskDate = task.date.toDate();
        
        // Include tasks from current month and a bit beyond
        if (taskDate >= start && taskDate <= end) {
          allTasks.push(task);
        }
      });

      setTasks(allTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setLoading(false);
    }
  };

  const handleTaskComplete = async (task) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // Mark task as completed
      await updateDoc(doc(db, 'tasks', task.id), {
        completed: true,
        completedAt: Timestamp.now(),
      });

      // Generate next task if plant data is available
      if (task.plantData) {
        // Get user plant to get custom settings
        const userPlantsRef = collection(db, 'userPlants');
        const userPlantQuery = query(userPlantsRef, where('userId', '==', userId), where('plantId', '==', task.plantId));
        const userPlantSnapshot = await getDocs(userPlantQuery);
        
        let userPlant = {};
        if (!userPlantSnapshot.empty) {
          userPlant = { id: userPlantSnapshot.docs[0].id, ...userPlantSnapshot.docs[0].data() };
        }

        const nextDate = getNextTaskDate(
          task.type,
          task.plantData,
          userPlant,
          new Date()
        );

        // Add next task
        const tasksRef = collection(db, 'tasks');
        await addDoc(tasksRef, {
          type: task.type,
          date: Timestamp.fromDate(nextDate),
          plantId: task.plantId,
          plantName: task.plantName,
          plantData: task.plantData,
          userId,
          userPlantId: task.userPlantId,
          completed: false,
          overdue: false,
        });
      }

      await loadTasks();
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = task.date.toDate();
      return isSameDay(taskDate, date);
    });
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  if (loading) {
    return <div className="calendar-loading">Loading calendar...</div>;
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h1>Care Calendar</h1>
        <div className="calendar-controls">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="nav-btn">
            <ChevronLeft size={20} />
          </button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="nav-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="calendar-days">
            {daysInMonth.map((day) => {
              const dayTasks = getTasksForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              
              return (
                <div
                  key={day.toString()}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${isCurrentDay ? 'today' : ''}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="day-number">{format(day, 'd')}</div>
                  <div className="day-tasks">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`task-dot ${task.completed ? 'completed' : task.overdue ? 'overdue' : ''}`}
                        title={getTaskLabel(task.type)}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="more-tasks">+{dayTasks.length - 3}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="calendar-sidebar">
          <h3>{format(selectedDate, 'EEEE, MMMM d')}</h3>
          {selectedDateTasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks scheduled for this day</p>
            </div>
          ) : (
            <div className="tasks-list">
              {selectedDateTasks.map((task) => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    <div className="task-header">
                      <span className="task-type">{getTaskLabel(task.type)}</span>
                      {task.completed ? (
                        <CheckCircle2 size={18} className="completed-icon" />
                      ) : (
                        <Circle
                          size={18}
                          className="complete-btn"
                          onClick={() => handleTaskComplete(task)}
                        />
                      )}
                    </div>
                    <span className="task-plant">{task.plantName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

