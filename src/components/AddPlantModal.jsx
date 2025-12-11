import { useState, useEffect } from 'react';
import { PLANT_DATABASE } from '../utils/plantData';
import { X } from 'lucide-react';
import './AddPlantModal.css';

const AddPlantModal = ({ plant, onClose, onSave }) => {
  const [selectedPlantId, setSelectedPlantId] = useState(plant?.plantId || '');
  const [isCustomPlant, setIsCustomPlant] = useState(plant?.isCustom || false);
  const [customName, setCustomName] = useState(plant?.name || '');
  const [tags, setTags] = useState(plant?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  // Custom plant form fields
  const [customPlantData, setCustomPlantData] = useState({
    name: plant?.name || '',
    type: plant?.plantData?.type || 'houseplant',
    description: plant?.plantData?.description || '',
    wateringFrequency: plant?.plantData?.wateringFrequency || plant?.customWateringFrequency || null,
    fertilizingFrequency: plant?.plantData?.fertilizingFrequency || plant?.customFertilizingFrequency || null,
    fertilizingSeason: plant?.plantData?.fertilizingSeason || 'spring-summer',
    pruningFrequency: plant?.plantData?.pruningFrequency || plant?.customPruningFrequency || null,
    repottingFrequency: plant?.plantData?.repottingFrequency || plant?.customRepottingFrequency || null,
    mistingFrequency: plant?.plantData?.mistingFrequency || plant?.customMistingFrequency || null,
    lightRotationFrequency: plant?.plantData?.lightRotationFrequency || plant?.customLightRotationFrequency || null,
    pestCheckFrequency: plant?.plantData?.pestCheckFrequency || plant?.customPestCheckFrequency || null,
    careLevel: plant?.plantData?.careLevel || 'moderate',
  });

  const [customSettings, setCustomSettings] = useState({
    customWateringFrequency: plant?.customWateringFrequency || null,
    customFertilizingFrequency: plant?.customFertilizingFrequency || null,
    customPruningFrequency: plant?.customPruningFrequency || null,
    customRepottingFrequency: plant?.customRepottingFrequency || null,
    customMistingFrequency: plant?.customMistingFrequency || null,
    customLightRotationFrequency: plant?.customLightRotationFrequency || null,
    customPestCheckFrequency: plant?.customPestCheckFrequency || null,
  });

  const selectedPlant = PLANT_DATABASE.find(p => p.id === selectedPlantId) || plant?.plantData;

  useEffect(() => {
    // If editing an existing custom plant
    if (plant?.isCustom && plant?.plantData) {
      setIsCustomPlant(true);
      setCustomPlantData({
        name: plant.name || '',
        type: plant.plantData.type || 'houseplant',
        description: plant.plantData.description || '',
        wateringFrequency: plant.plantData.wateringFrequency || null,
        fertilizingFrequency: plant.plantData.fertilizingFrequency || null,
        fertilizingSeason: plant.plantData.fertilizingSeason || 'spring-summer',
        pruningFrequency: plant.plantData.pruningFrequency || null,
        repottingFrequency: plant.plantData.repottingFrequency || null,
        mistingFrequency: plant.plantData.mistingFrequency || null,
        lightRotationFrequency: plant.plantData.lightRotationFrequency || null,
        pestCheckFrequency: plant.plantData.pestCheckFrequency || null,
        careLevel: plant.plantData.careLevel || 'moderate',
      });
      setTags(plant.tags || []);
    } else if (selectedPlantId && selectedPlantId !== 'custom' && !customName) {
      setCustomName(selectedPlant?.name || '');
      setIsCustomPlant(false);
    } else if (selectedPlantId === 'custom') {
      setIsCustomPlant(true);
    }
  }, [selectedPlantId, selectedPlant, plant]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (isCustomPlant || plant?.isCustom) {
      // Validate custom plant data
      if (!customPlantData.name.trim()) {
        alert('Please enter a plant name');
        return;
      }
      if (!customPlantData.wateringFrequency) {
        alert('Please enter watering frequency (this is required for task generation)');
        return;
      }

      // Create custom plant data object
      const customPlant = {
        id: plant?.plantData?.id || `custom-${Date.now()}`,
        name: customPlantData.name.trim(),
        type: customPlantData.type,
        description: customPlantData.description.trim(),
        wateringFrequency: parseInt(customPlantData.wateringFrequency) || null,
        fertilizingFrequency: customPlantData.fertilizingFrequency ? parseInt(customPlantData.fertilizingFrequency) : null,
        fertilizingSeason: customPlantData.fertilizingSeason,
        pruningFrequency: customPlantData.pruningFrequency ? parseInt(customPlantData.pruningFrequency) : null,
        repottingFrequency: customPlantData.repottingFrequency ? parseInt(customPlantData.repottingFrequency) : null,
        mistingFrequency: customPlantData.mistingFrequency ? parseInt(customPlantData.mistingFrequency) : null,
        lightRotationFrequency: customPlantData.lightRotationFrequency ? parseInt(customPlantData.lightRotationFrequency) : null,
        pestCheckFrequency: customPlantData.pestCheckFrequency ? parseInt(customPlantData.pestCheckFrequency) : null,
        careLevel: customPlantData.careLevel,
      };

      const settings = {
        customName: customPlantData.name.trim(),
        tags,
        isCustom: true,
      };

      if (plant?.id) {
        // Editing existing custom plant
        onSave(plant.id, { ...settings, plantData: customPlant });
      } else {
        // Adding new custom plant
        onSave(customPlant, settings);
      }
    } else {
      if (!selectedPlant && !plant?.plantData) {
        alert('Please select a plant');
        return;
      }

      const plantData = selectedPlant || plant.plantData;
      const settings = {
        customName: customName || plantData.name,
        tags,
        ...customSettings,
        isCustom: false,
      };

      if (plant?.id) {
        onSave(plant.id, settings);
      } else {
        onSave(plantData, settings);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{plant?.id ? 'Edit Plant' : 'Add Plant to Collection'}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {!plant?.plantData && !plant?.isCustom && (
            <div className="form-group">
              <label>Select Plant or Add Custom</label>
              <select
                value={selectedPlantId}
                onChange={(e) => setSelectedPlantId(e.target.value)}
                className="form-select"
              >
                <option value="">Choose a plant...</option>
                <option value="custom">➕ Add Custom Plant</option>
                <optgroup label="From Database">
                  {PLANT_DATABASE.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.type})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          {(isCustomPlant || plant?.isCustom) && (
            <div className="custom-plant-form">
              <div className="form-section">
                <h3>Plant Information</h3>
                <div className="form-group">
                  <label>Plant Name *</label>
                  <input
                    type="text"
                    value={customPlantData.name}
                    onChange={(e) => setCustomPlantData({ ...customPlantData, name: e.target.value })}
                    placeholder="e.g., Areca Palm"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Plant Type</label>
                  <select
                    value={customPlantData.type}
                    onChange={(e) => setCustomPlantData({ ...customPlantData, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="houseplant">Houseplant</option>
                    <option value="herb">Herb</option>
                    <option value="garden">Garden</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description (optional)</label>
                  <textarea
                    value={customPlantData.description}
                    onChange={(e) => setCustomPlantData({ ...customPlantData, description: e.target.value })}
                    placeholder="Add notes about your plant..."
                    className="form-input"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Care Level</label>
                  <select
                    value={customPlantData.careLevel}
                    onChange={(e) => setCustomPlantData({ ...customPlantData, careLevel: e.target.value })}
                    className="form-select"
                  >
                    <option value="very-easy">Very Easy</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="difficult">Difficult</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3>Care Schedule</h3>
                <p className="section-description">
                  Enter how often each care task should be performed (in days). Leave blank if not applicable.
                </p>

                <div className="settings-grid">
                  <div className="form-group">
                    <label>Watering Frequency (days) *</label>
                    <input
                      type="number"
                      value={customPlantData.wateringFrequency || ''}
                      onChange={(e) => setCustomPlantData({
                        ...customPlantData,
                        wateringFrequency: e.target.value ? parseInt(e.target.value) : null
                      })}
                      placeholder="e.g., 7"
                      className="form-input"
                      min="1"
                      required
                    />
                    <small>Required - How often to water</small>
                  </div>

                  <div className="form-group">
                    <label>Fertilizing Frequency (days)</label>
                    <input
                      type="number"
                      value={customPlantData.fertilizingFrequency || ''}
                      onChange={(e) => setCustomPlantData({
                        ...customPlantData,
                        fertilizingFrequency: e.target.value ? parseInt(e.target.value) : null
                      })}
                      placeholder="e.g., 30"
                      className="form-input"
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>Fertilizing Season</label>
                    <select
                      value={customPlantData.fertilizingSeason}
                      onChange={(e) => setCustomPlantData({ ...customPlantData, fertilizingSeason: e.target.value })}
                      className="form-select"
                    >
                      <option value="all-year">All Year</option>
                      <option value="spring-summer">Spring & Summer</option>
                      <option value="spring">Spring Only</option>
                      <option value="summer">Summer Only</option>
                      <option value="fall">Fall</option>
                      <option value="winter">Winter</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Pruning Frequency (days)</label>
                    <input
                      type="number"
                      value={customPlantData.pruningFrequency || ''}
                      onChange={(e) => setCustomPlantData({
                        ...customPlantData,
                        pruningFrequency: e.target.value ? parseInt(e.target.value) : null
                      })}
                      placeholder="e.g., 90"
                      className="form-input"
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>Repotting Frequency (days)</label>
                    <input
                      type="number"
                      value={customPlantData.repottingFrequency || ''}
                      onChange={(e) => setCustomPlantData({
                        ...customPlantData,
                        repottingFrequency: e.target.value ? parseInt(e.target.value) : null
                      })}
                      placeholder="e.g., 365"
                      className="form-input"
                      min="1"
                    />
                    <small>Typically once per year (365 days)</small>
                  </div>

                  <div className="form-group">
                    <label>Misting Frequency (days)</label>
                    <input
                      type="number"
                      value={customPlantData.mistingFrequency || ''}
                      onChange={(e) => setCustomPlantData({
                        ...customPlantData,
                        mistingFrequency: e.target.value ? parseInt(e.target.value) : null
                      })}
                      placeholder="e.g., 3"
                      className="form-input"
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>Light Rotation Frequency (days)</label>
                    <input
                      type="number"
                      value={customPlantData.lightRotationFrequency || ''}
                      onChange={(e) => setCustomPlantData({
                        ...customPlantData,
                        lightRotationFrequency: e.target.value ? parseInt(e.target.value) : null
                      })}
                      placeholder="e.g., 7"
                      className="form-input"
                      min="1"
                    />
                    <small>Rotate plant for even light exposure</small>
                  </div>

                  <div className="form-group">
                    <label>Pest Check Frequency (days)</label>
                    <input
                      type="number"
                      value={customPlantData.pestCheckFrequency || ''}
                      onChange={(e) => setCustomPlantData({
                        ...customPlantData,
                        pestCheckFrequency: e.target.value ? parseInt(e.target.value) : null
                      })}
                      placeholder="e.g., 14"
                      className="form-input"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Tags (e.g., indoor, outdoor, sensitive to cold)</label>
                <div className="tag-input-group">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag..."
                    className="form-input"
                  />
                  <button onClick={handleAddTag} className="add-tag-btn">Add</button>
                </div>
                <div className="tags-display">
                  {tags.map((tag) => (
                    <span key={tag} className="tag-item">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="remove-tag">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedPlant && !isCustomPlant && (
            <>
              <div className="form-group">
                <label>Custom Name (optional)</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={selectedPlant.name}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Tags (e.g., indoor, outdoor, sensitive to cold)</label>
                <div className="tag-input-group">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag..."
                    className="form-input"
                  />
                  <button onClick={handleAddTag} className="add-tag-btn">Add</button>
                </div>
                <div className="tags-display">
                  {tags.map((tag) => (
                    <span key={tag} className="tag-item">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="remove-tag">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Custom Care Settings (optional)</h3>
                <p className="section-description">
                  Leave blank to use default values from the plant database
                </p>

                <div className="settings-grid">
                  {selectedPlant.wateringFrequency && (
                    <div className="form-group">
                      <label>Watering Frequency (days)</label>
                      <input
                        type="number"
                        value={customSettings.customWateringFrequency || ''}
                        onChange={(e) => setCustomSettings({
                          ...customSettings,
                          customWateringFrequency: e.target.value ? parseInt(e.target.value) : null
                        })}
                        placeholder={selectedPlant.wateringFrequency}
                        className="form-input"
                      />
                    </div>
                  )}

                  {selectedPlant.fertilizingFrequency && (
                    <div className="form-group">
                      <label>Fertilizing Frequency (days)</label>
                      <input
                        type="number"
                        value={customSettings.customFertilizingFrequency || ''}
                        onChange={(e) => setCustomSettings({
                          ...customSettings,
                          customFertilizingFrequency: e.target.value ? parseInt(e.target.value) : null
                        })}
                        placeholder={selectedPlant.fertilizingFrequency}
                        className="form-input"
                      />
                    </div>
                  )}

                  {selectedPlant.mistingFrequency && (
                    <div className="form-group">
                      <label>Misting Frequency (days)</label>
                      <input
                        type="number"
                        value={customSettings.customMistingFrequency || ''}
                        onChange={(e) => setCustomSettings({
                          ...customSettings,
                          customMistingFrequency: e.target.value ? parseInt(e.target.value) : null
                        })}
                        placeholder={selectedPlant.mistingFrequency}
                        className="form-input"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button 
            onClick={handleSave} 
            className="save-btn" 
            disabled={!isCustomPlant && !selectedPlant && !plant?.plantData}
          >
            {plant?.id ? 'Update' : 'Add Plant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlantModal;

