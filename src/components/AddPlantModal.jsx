import { useState, useEffect } from 'react';
import { PLANT_DATABASE } from '../utils/plantData';
import { X } from 'lucide-react';
import './AddPlantModal.css';

const AddPlantModal = ({ plant, onClose, onSave }) => {
  const [selectedPlantId, setSelectedPlantId] = useState(plant?.plantId || '');
  const [customName, setCustomName] = useState(plant?.name || '');
  const [tags, setTags] = useState(plant?.tags || []);
  const [tagInput, setTagInput] = useState('');
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
    if (selectedPlantId && !customName) {
      setCustomName(selectedPlant?.name || '');
    }
  }, [selectedPlantId, selectedPlant]);

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
    if (!selectedPlant && !plant?.plantData) {
      alert('Please select a plant');
      return;
    }

    const plantData = selectedPlant || plant.plantData;
    const settings = {
      customName: customName || plantData.name,
      tags,
      ...customSettings,
    };

    if (plant?.id) {
      onSave(plant.id, settings);
    } else {
      onSave(plantData, settings);
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
          {!plant?.plantData && (
            <div className="form-group">
              <label>Select Plant</label>
              <select
                value={selectedPlantId}
                onChange={(e) => setSelectedPlantId(e.target.value)}
                className="form-select"
              >
                <option value="">Choose a plant...</option>
                {PLANT_DATABASE.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedPlant && (
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
          <button onClick={handleSave} className="save-btn" disabled={!selectedPlant && !plant?.plantData}>
            {plant?.id ? 'Update' : 'Add Plant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlantModal;

