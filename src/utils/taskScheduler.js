import { addDays, isBefore, isAfter, startOfDay, format } from 'date-fns';
import { TASK_TYPES } from './plantData';

/**
 * Get the current season based on date
 * Returns: 'spring', 'summer', 'fall', 'winter'
 */
export const getSeason = (date = new Date()) => {
  const month = date.getMonth() + 1; // 1-12
  
  // Northern hemisphere seasons
  // Spring: March (3) - May (5)
  // Summer: June (6) - August (8)
  // Fall: September (9) - November (11)
  // Winter: December (12) - February (2)
  
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter'; // month === 12 || month <= 2
};

/**
 * Adjust watering frequency based on season and plant type
 * Outdoor and garden plants are more affected by seasons
 */
const getSeasonalWateringFrequency = (baseFrequency, plantType, date) => {
  if (!baseFrequency) return null;
  
  const season = getSeason(date);
  const isOutdoorPlant = plantType === 'outdoor' || plantType === 'garden';
  
  // For outdoor/garden plants, apply significant seasonal adjustments
  if (isOutdoorPlant) {
    switch (season) {
      case 'summer':
        // Summer: More frequent watering (reduce interval by ~30-40%)
        return Math.max(1, Math.round(baseFrequency * 0.6));
      case 'winter':
        // Winter: Less frequent watering (increase interval by ~50-100%)
        return Math.round(baseFrequency * 1.8);
      case 'spring':
        // Spring: Slight increase (reduce interval by ~15%)
        return Math.max(1, Math.round(baseFrequency * 0.85));
      case 'fall':
        // Fall: Slight decrease (increase interval by ~20%)
        return Math.round(baseFrequency * 1.2);
      default:
        return baseFrequency;
    }
  }
  
  // For houseplants and herbs, apply milder adjustments
  switch (season) {
    case 'summer':
      // Summer: Slight increase
      return Math.max(1, Math.round(baseFrequency * 0.9));
    case 'winter':
      // Winter: Slight decrease
      return Math.round(baseFrequency * 1.2);
    case 'spring':
    case 'fall':
      // Spring/Fall: Base frequency
      return baseFrequency;
    default:
      return baseFrequency;
  }
};

/**
 * Adjust misting frequency based on season
 * More misting needed in summer (dry air), less in winter
 */
const getSeasonalMistingFrequency = (baseFrequency, date) => {
  if (!baseFrequency) return null;
  
  const season = getSeason(date);
  
  switch (season) {
    case 'summer':
      // Summer: More frequent misting (reduce interval by ~20%)
      return Math.max(1, Math.round(baseFrequency * 0.8));
    case 'winter':
      // Winter: Less frequent misting (increase interval by ~30%)
      return Math.round(baseFrequency * 1.3);
    default:
      return baseFrequency;
  }
};

/**
 * Adjust pruning frequency based on season
 * More pruning in spring/fall, less in winter
 */
const getSeasonalPruningFrequency = (baseFrequency, date) => {
  if (!baseFrequency) return null;
  
  const season = getSeason(date);
  
  switch (season) {
    case 'winter':
      // Winter: Less pruning (increase interval by ~50%)
      return Math.round(baseFrequency * 1.5);
    case 'spring':
    case 'fall':
      // Spring/Fall: More pruning (reduce interval by ~20%)
      return Math.max(1, Math.round(baseFrequency * 0.8));
    default:
      return baseFrequency;
  }
};

/**
 * Adjust pest check frequency based on season
 * More frequent checks in summer (pest season)
 */
const getSeasonalPestCheckFrequency = (baseFrequency, date) => {
  if (!baseFrequency) return null;
  
  const season = getSeason(date);
  
  switch (season) {
    case 'summer':
      // Summer: More frequent checks (reduce interval by ~30%)
      return Math.max(1, Math.round(baseFrequency * 0.7));
    case 'winter':
      // Winter: Less frequent checks (increase interval by ~30%)
      return Math.round(baseFrequency * 1.3);
    default:
      return baseFrequency;
  }
};

/**
 * Generate tasks for a user's plant based on plant data and custom settings
 */
export const generateTasksForPlant = (plantData, userPlant, startDate = new Date()) => {
  const tasks = [];
  const today = startOfDay(startDate);
  
  // Use custom settings if available, otherwise use plant defaults
  const baseWateringFreq = userPlant.customWateringFrequency || plantData.wateringFrequency;
  const fertilizingFreq = userPlant.customFertilizingFrequency || plantData.fertilizingFrequency;
  const basePruningFreq = userPlant.customPruningFrequency || plantData.pruningFrequency;
  const repottingFreq = userPlant.customRepottingFrequency || plantData.repottingFrequency;
  const baseMistingFreq = userPlant.customMistingFrequency || plantData.mistingFrequency;
  const lightRotationFreq = userPlant.customLightRotationFrequency || plantData.lightRotationFrequency;
  const basePestCheckFreq = userPlant.customPestCheckFrequency || plantData.pestCheckFrequency;
  
  // Generate tasks for the next 90 days
  const daysToGenerate = 90;
  const plantType = plantData.type || 'houseplant';
  
  // Watering tasks with seasonal adjustments
  if (baseWateringFreq) {
    let currentDay = 0;
    while (currentDay < daysToGenerate) {
      const taskDate = addDays(today, currentDay);
      const adjustedFreq = getSeasonalWateringFrequency(baseWateringFreq, plantType, taskDate);
      
      tasks.push({
        type: TASK_TYPES.WATERING,
        date: taskDate,
        plantId: userPlant.id,
        plantName: userPlant.name || plantData.name,
        completed: false,
        overdue: false,
      });
      
      // Move to next task date using adjusted frequency
      currentDay += adjustedFreq;
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
  
  // Pruning tasks with seasonal adjustments
  if (basePruningFreq) {
    let currentDay = 0;
    while (currentDay < daysToGenerate) {
      const taskDate = addDays(today, currentDay);
      const adjustedFreq = getSeasonalPruningFrequency(basePruningFreq, taskDate);
      
      tasks.push({
        type: TASK_TYPES.PRUNING,
        date: taskDate,
        plantId: userPlant.id,
        plantName: userPlant.name || plantData.name,
        completed: false,
        overdue: false,
      });
      
      currentDay += adjustedFreq;
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
  
  // Misting tasks with seasonal adjustments
  if (baseMistingFreq) {
    let currentDay = 0;
    while (currentDay < daysToGenerate) {
      const taskDate = addDays(today, currentDay);
      const adjustedFreq = getSeasonalMistingFrequency(baseMistingFreq, taskDate);
      
      tasks.push({
        type: TASK_TYPES.MISTING,
        date: taskDate,
        plantId: userPlant.id,
        plantName: userPlant.name || plantData.name,
        completed: false,
        overdue: false,
      });
      
      currentDay += adjustedFreq;
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
  
  // Pest check tasks with seasonal adjustments
  if (basePestCheckFreq) {
    let currentDay = 0;
    while (currentDay < daysToGenerate) {
      const taskDate = addDays(today, currentDay);
      const adjustedFreq = getSeasonalPestCheckFrequency(basePestCheckFreq, taskDate);
      
      tasks.push({
        type: TASK_TYPES.PEST_CHECK,
        date: taskDate,
        plantId: userPlant.id,
        plantName: userPlant.name || plantData.name,
        completed: false,
        overdue: false,
      });
      
      currentDay += adjustedFreq;
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
 * Uses seasonal adjustments for appropriate task types
 */
export const getNextTaskDate = (taskType, plantData, userPlant, completedDate) => {
  const today = startOfDay(completedDate || new Date());
  const plantType = plantData.type || 'houseplant';
  
  switch (taskType) {
    case TASK_TYPES.WATERING:
      const baseWateringFreq = userPlant.customWateringFrequency || plantData.wateringFrequency;
      const adjustedWateringFreq = getSeasonalWateringFrequency(baseWateringFreq, plantType, today);
      return addDays(today, adjustedWateringFreq);
      
    case TASK_TYPES.FERTILIZING:
      return addDays(today, userPlant.customFertilizingFrequency || plantData.fertilizingFrequency);
      
    case TASK_TYPES.PRUNING:
      const basePruningFreq = userPlant.customPruningFrequency || plantData.pruningFrequency;
      const adjustedPruningFreq = getSeasonalPruningFrequency(basePruningFreq, today);
      return addDays(today, adjustedPruningFreq);
      
    case TASK_TYPES.MISTING:
      const baseMistingFreq = userPlant.customMistingFrequency || plantData.mistingFrequency;
      const adjustedMistingFreq = getSeasonalMistingFrequency(baseMistingFreq, today);
      return addDays(today, adjustedMistingFreq);
      
    case TASK_TYPES.LIGHT_ROTATION:
      return addDays(today, userPlant.customLightRotationFrequency || plantData.lightRotationFrequency);
      
    case TASK_TYPES.PEST_CHECK:
      const basePestCheckFreq = userPlant.customPestCheckFrequency || plantData.pestCheckFrequency;
      const adjustedPestCheckFreq = getSeasonalPestCheckFrequency(basePestCheckFreq, today);
      return addDays(today, adjustedPestCheckFreq);
      
    default:
      return addDays(today, 7);
  }
};

