import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { PLANT_DATABASE, TASK_TYPES } from '../utils/plantData';
import { generateTasksForPlant } from '../utils/taskScheduler';
import { Plus, Trash2, Edit2, Flower2 } from 'lucide-react';
import AddPlantModal from './AddPlantModal';
import './MyPlants.css';

const MyPlants = () => {
  const [userPlants, setUserPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);

  useEffect(() => {
    loadUserPlants();
    
    // Check if URL has add parameter
    const urlParams = new URLSearchParams(window.location.search);
    const addPlantId = urlParams.get('add');
    if (addPlantId) {
      const plant = PLANT_DATABASE.find(p => p.id === addPlantId);
      if (plant) {
        setEditingPlant({ plantData: plant });
        setShowAddModal(true);
      }
    }
  }, []);

  const loadUserPlants = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const plantsRef = collection(db, 'userPlants');
      const q = query(plantsRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      const plants = [];
      snapshot.forEach((doc) => {
        plants.push({ id: doc.id, ...doc.data() });
      });
      
      setUserPlants(plants);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user plants:', error);
      setLoading(false);
    }
  };

  const handleAddPlant = async (plantData, customSettings) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const isCustom = customSettings.isCustom || false;
      
      // Helper function to remove undefined values (Firestore doesn't accept undefined)
      const removeUndefined = (obj) => {
        const cleaned = {};
        Object.keys(obj).forEach(key => {
          if (obj[key] !== undefined) {
            cleaned[key] = obj[key];
          }
        });
        return cleaned;
      };
      
      const newPlant = removeUndefined({
        userId,
        plantId: plantData.id,
        name: customSettings.customName || plantData.name,
        plantData: plantData,
        isCustom: isCustom,
        addedDate: Timestamp.now(),
        tags: customSettings.tags || [],
        // For custom plants, the frequencies are already in plantData
        // For database plants, use custom settings if provided
        customWateringFrequency: isCustom ? null : customSettings.customWateringFrequency,
        customFertilizingFrequency: isCustom ? null : customSettings.customFertilizingFrequency,
        customPruningFrequency: isCustom ? null : customSettings.customPruningFrequency,
        customRepottingFrequency: isCustom ? null : customSettings.customRepottingFrequency,
        customMistingFrequency: isCustom ? null : customSettings.customMistingFrequency,
        customLightRotationFrequency: isCustom ? null : customSettings.customLightRotationFrequency,
        customPestCheckFrequency: isCustom ? null : customSettings.customPestCheckFrequency,
        // Only include lastRepottingDate if it exists (not undefined)
        ...(customSettings.lastRepottingDate !== undefined ? {
          lastRepottingDate: customSettings.lastRepottingDate 
            ? (customSettings.lastRepottingDate instanceof Date 
                ? Timestamp.fromDate(customSettings.lastRepottingDate)
                : Timestamp.fromDate(new Date(customSettings.lastRepottingDate)))
            : null
        } : {}),
      });

      const docRef = await addDoc(collection(db, 'userPlants'), newPlant);
      
      // Generate initial tasks
      await generateAndSaveTasks(docRef.id, plantData, newPlant);
      
      await loadUserPlants();
      setShowAddModal(false);
      setEditingPlant(null);
    } catch (error) {
      console.error('Error adding plant:', error);
      alert('Failed to add plant. Please try again.');
    }
  };

  const generateAndSaveTasks = async (userPlantId, plantData, userPlant) => {
    try {
      const userId = auth.currentUser?.uid;
      const tasks = generateTasksForPlant(plantData, { ...userPlant, id: userPlantId });
      
      const tasksRef = collection(db, 'tasks');
      const tasksToAdd = tasks.map(task => ({
        ...task,
        userId,
        userPlantId,
        plantId: plantData.id,
        plantData: {
          id: plantData.id,
          name: plantData.name,
          type: plantData.type,
          wateringFrequency: plantData.wateringFrequency,
          fertilizingFrequency: plantData.fertilizingFrequency,
          fertilizingSeason: plantData.fertilizingSeason,
          pruningFrequency: plantData.pruningFrequency,
          repottingFrequency: plantData.repottingFrequency,
          mistingFrequency: plantData.mistingFrequency,
          lightRotationFrequency: plantData.lightRotationFrequency,
          pestCheckFrequency: plantData.pestCheckFrequency,
        },
        date: Timestamp.fromDate(task.date),
      }));

      // Add tasks to Firestore
      for (const task of tasksToAdd) {
        await addDoc(tasksRef, task);
      }
    } catch (error) {
      console.error('Error generating tasks:', error);
    }
  };

  const handleDeletePlant = async (plantId) => {
    if (!confirm('Are you sure you want to remove this plant? This will also delete all associated tasks.')) {
      return;
    }

    try {
      // Delete plant
      await deleteDoc(doc(db, 'userPlants', plantId));
      
      // Delete associated tasks
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, where('userPlantId', '==', plantId));
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      await loadUserPlants();
    } catch (error) {
      console.error('Error deleting plant:', error);
      alert('Failed to delete plant. Please try again.');
    }
  };

  const handleEditPlant = (plant) => {
    // If it's a custom plant, use the stored plantData
    // Otherwise, try to find it in the database
    const plantData = plant.isCustom 
      ? plant.plantData 
      : PLANT_DATABASE.find(p => p.id === plant.plantId) || plant.plantData;
    setEditingPlant({ ...plant, plantData });
    setShowAddModal(true);
  };

  const handleUpdatePlant = async (plantId, updates) => {
    try {
      // Helper function to remove undefined values (Firestore doesn't accept undefined)
      const removeUndefined = (obj) => {
        const cleaned = {};
        Object.keys(obj).forEach(key => {
          if (obj[key] !== undefined) {
            cleaned[key] = obj[key];
          }
        });
        return cleaned;
      };

      // If updating a custom plant, merge plantData
      if (updates.isCustom && updates.plantData) {
        await updateDoc(doc(db, 'userPlants', plantId), removeUndefined({
          name: updates.customName,
          plantData: updates.plantData,
          tags: updates.tags,
          isCustom: true,
        }));
      } else {
        // Regular update for database plants
        await updateDoc(doc(db, 'userPlants', plantId), removeUndefined({
          name: updates.customName,
          tags: updates.tags,
          customWateringFrequency: updates.customWateringFrequency,
          customFertilizingFrequency: updates.customFertilizingFrequency,
          customPruningFrequency: updates.customPruningFrequency,
          customRepottingFrequency: updates.customRepottingFrequency,
          customMistingFrequency: updates.customMistingFrequency,
          customLightRotationFrequency: updates.customLightRotationFrequency,
          customPestCheckFrequency: updates.customPestCheckFrequency,
        }));
      }
      
      await loadUserPlants();
      setShowAddModal(false);
      setEditingPlant(null);
    } catch (error) {
      console.error('Error updating plant:', error);
      alert('Failed to update plant. Please try again.');
    }
  };

  if (loading) {
    return <div className="my-plants-loading">Loading your plants...</div>;
  }

  return (
    <div className="my-plants">
      <div className="my-plants-header">
        <div>
          <h1>My Plants</h1>
          <p>Manage your plant collection</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="add-plant-header-btn">
          <Plus size={20} />
          Add Plant
        </button>
      </div>

      {userPlants.length === 0 ? (
        <div className="empty-collection">
          <Flower2 size={64} color="var(--text-light)" />
          <h2>No plants yet</h2>
          <p>Start by adding plants from the database</p>
          <button onClick={() => setShowAddModal(true)} className="add-first-plant-btn">
            <Plus size={20} />
            Add Your First Plant
          </button>
        </div>
      ) : (
        <div className="plants-list">
          {userPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onDelete={handleDeletePlant}
              onEdit={handleEditPlant}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddPlantModal
          plant={editingPlant}
          onClose={() => {
            setShowAddModal(false);
            setEditingPlant(null);
          }}
          onSave={editingPlant?.id ? handleUpdatePlant : handleAddPlant}
        />
      )}
    </div>
  );
};

const PlantCard = ({ plant, onDelete, onEdit }) => {
  const plantData = plant.isCustom 
    ? plant.plantData 
    : PLANT_DATABASE.find(p => p.id === plant.plantId) || plant.plantData || {};
  
  return (
    <div className="user-plant-card">
      <div className="plant-card-content">
        <div>
          <h3>{plant.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <p className="plant-type">{plantData.type || 'Unknown'}</p>
            {plant.isCustom && (
              <span className="custom-badge" title="Custom plant">Custom</span>
            )}
          </div>
          {plant.tags && plant.tags.length > 0 && (
            <div className="plant-tags">
              {plant.tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="plant-actions">
          <button onClick={() => onEdit(plant)} className="edit-btn">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(plant.id)} className="delete-btn">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPlants;

