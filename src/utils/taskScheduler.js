import { addDays, isBefore, isAfter, startOfDay, format } from 'date-fns';
import { TASK_TYPES } from './plantData';

/**
 * Generate tasks for a user's plant based on plant data and custom settings
 */
export const generateTasksForPlant = (plantData, userPlant, startDate = new Date()) => {
  const tasks = [];
  const today = startOfDay(startDate);
  
  // Use custom settings if available, otherwise use plant defaults
  const wateringFreq = userPlant.customWateringFrequency || plantData.wateringFrequency;
  const fertilizingFreq = userPlant.customFertilizingFrequency || plantData.fertilizingFrequency;
  const pruningFreq = userPlant.customPruningFrequency || plantData.pruningFrequency;
  const repottingFreq = userPlant.customRepottingFrequency || plantData.repottingFrequency;
  const mistingFreq = userPlant.customMistingFrequency || plantData.mistingFrequency;
  const lightRotationFreq = userPlant.customLightRotationFrequency || plantData.lightRotationFrequency;
  const pestCheckFreq = userPlant.customPestCheckFrequency || plantData.pestCheckFrequency;
  
  // Generate tasks for the next 90 days
  const daysToGenerate = 90;
  
  // Watering tasks
  if (wateringFreq) {
    for (let day = 0; day < daysToGenerate; day += wateringFreq) {
      tasks.push({
        type: TASK_TYPES.WATERING,
        date: addDays(today, day),
        plantId: userPlant.id,
        plantName: userPlant.name || plantData.name,
        completed: false,
        overdue: false,
      });
    }
  }
  
  // Fertilizing tasks (consider season)
  if (fertilizingFreq && shouldFertilize(plantData.fertilizingSeason, today)) {
    for (let day = 0; day < daysToGenerate; day += fertilizingFreq) {
      const taskDate = addDays(today, day);
      if (shouldFertilize(plantData.fertilizingSeason, taskDate)) {
        tasks.push({
          type: TASK_TYPES.FERTILIZING,
          date: taskDate,
          plantId: userPlant.id,
          plantName: userPlant.name || plantData.name,
          completed: false,
          overdue: false,
        });
      }
    }
  }
  
  // Pruning tasks
  if (pruningFreq) {
    for (let day = 0; day < daysToGenerate; day += pruningFreq) {
      tasks.push({
        type: TASK_TYPES.PRUNING,
        date: addDays(today, day),
        plantId: userPlant.id,
        plantName: userPlant.name || plantData.name,
        completed: false,
        overdue: false,
      });
    }
  }
  
  // Repotting tasks
  if (repottingFreq) {
    const lastRepotting = userPlant.lastRepottingDate 
      ? new Date(userPlant.lastRepottingDate)
      : userPlant.addedDate 
        ? new Date(userPlant.addedDate)
        : today;
    
    const nextRepotting = addDays(lastRepotting, repottingFreq);
    if (isBefore(nextRepotting, addDays(today, daysToGenerate))) {
      tasks.push({
        type: TASK_TYPES.REPOTTING,
        date: nextRepotting,
        plantId: userPlant.id,
        plantName: userPlant.name || plantData.name,
        completed: false,
        overdue: false,
      });
    }
  }
  
  // Misting tasks
  if (mistingFreq) {
    for (let day = 0; day < daysToGenerate; day += mistingFreq) {
      tasks.push({
        type: TASK_TYPES.MISTING,
        date: addDays(today, day),
        plantId: userPlant.id,
        plantName: userPlant.name || plantData.name,
        completed: false,
        overdue: false,
      });
    }
  }
  
  // Light rotation tasks
  if (lightRotationFreq) {
    for (let day = 0; day < daysToGenerate; day += lightRotationFreq) {
      tasks.push({
        type: TASK_TYPES.LIGHT_ROTATION,
        date: addDays(today, day),
        plantId: userPlant.id,
        plantName: userPlant.name || plantData.name,
        completed: false,
        overdue: false,
      });
    }
  }
  
  // Pest check tasks
  if (pestCheckFreq) {
    for (let day = 0; day < daysToGenerate; day += pestCheckFreq) {
      tasks.push({
        type: TASK_TYPES.PEST_CHECK,
        date: addDays(today, day),
        plantId: userPlant.id,
        plantName: userPlant.name || plantData.name,
        completed: false,
        overdue: false,
      });
    }
  }
  
  // Mark overdue tasks
  const now = startOfDay(new Date());
  tasks.forEach(task => {
    if (isBefore(task.date, now) && !task.completed) {
      task.overdue = true;
    }
  });
  
  return tasks;
};

/**
 * Check if fertilizing should happen based on season
 */
const shouldFertilize = (season, date) => {
  if (!season) return true;
  if (season === 'all-year') return true;
  
  const month = date.getMonth() + 1; // 1-12
  
  if (season === 'spring') return month >= 3 && month <= 5;
  if (season === 'summer') return month >= 6 && month <= 8;
  if (season === 'fall') return month >= 9 && month <= 11;
  if (season === 'winter') return month === 12 || month <= 2;
  if (season === 'spring-summer') return month >= 3 && month <= 8;
  
  return true;
};

/**
 * Get next task date after completion
 */
export const getNextTaskDate = (taskType, plantData, userPlant, completedDate) => {
  const today = startOfDay(completedDate || new Date());
  
  switch (taskType) {
    case TASK_TYPES.WATERING:
      return addDays(today, userPlant.customWateringFrequency || plantData.wateringFrequency);
    case TASK_TYPES.FERTILIZING:
      return addDays(today, userPlant.customFertilizingFrequency || plantData.fertilizingFrequency);
    case TASK_TYPES.PRUNING:
      return addDays(today, userPlant.customPruningFrequency || plantData.pruningFrequency);
    case TASK_TYPES.MISTING:
      return addDays(today, userPlant.customMistingFrequency || plantData.mistingFrequency);
    case TASK_TYPES.LIGHT_ROTATION:
      return addDays(today, userPlant.customLightRotationFrequency || plantData.lightRotationFrequency);
    case TASK_TYPES.PEST_CHECK:
      return addDays(today, userPlant.customPestCheckFrequency || plantData.pestCheckFrequency);
    default:
      return addDays(today, 7);
  }
};

