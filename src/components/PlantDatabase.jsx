import { useState, useEffect } from 'react';
import { PLANT_DATABASE } from '../utils/plantData';
import { Search, Plus } from 'lucide-react';
import './PlantDatabase.css';

const PlantDatabase = () => {
  const [plants, setPlants] = useState(PLANT_DATABASE);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || plant.type === filterType;
    return matchesSearch && matchesType;
  });

  const plantTypes = ['all', 'houseplant', 'herb', 'garden'];

  return (
    <div className="plant-database">
      <div className="database-header">
        <h1>Plant Database</h1>
        <p>Browse and add plants to your collection</p>
      </div>

      <div className="database-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="type-filters">
          {plantTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`filter-btn ${filterType === type ? 'active' : ''}`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="plants-grid">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="empty-state">
          <p>No plants found matching your search.</p>
        </div>
      )}
    </div>
  );
};

const PlantCard = ({ plant }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="plant-card">
      <div className="plant-card-header">
        <h3>{plant.name}</h3>
        <span className={`care-badge ${plant.careLevel}`}>
          {plant.careLevel === 'very-easy' ? 'Very Easy' :
           plant.careLevel === 'easy' ? 'Easy' :
           plant.careLevel === 'moderate' ? 'Moderate' : plant.careLevel}
        </span>
      </div>
      
      <p className="plant-type">{plant.type}</p>
      <p className="plant-description">{plant.description}</p>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="details-toggle"
      >
        {showDetails ? 'Hide' : 'Show'} Care Details
      </button>
      
      {showDetails && (
        <div className="care-details">
          <div className="care-item">
            <span>Watering:</span>
            <span>{plant.wateringFrequency ? `Every ${plant.wateringFrequency} days` : 'N/A'}</span>
          </div>
          {plant.fertilizingFrequency && (
            <div className="care-item">
              <span>Fertilizing:</span>
              <span>Every {plant.fertilizingFrequency} days ({plant.fertilizingSeason})</span>
            </div>
          )}
          {plant.pruningFrequency && (
            <div className="care-item">
              <span>Pruning:</span>
              <span>Every {plant.pruningFrequency} days</span>
            </div>
          )}
          {plant.repottingFrequency && (
            <div className="care-item">
              <span>Repotting:</span>
              <span>Every {Math.floor(plant.repottingFrequency / 30)} months</span>
            </div>
          )}
          {plant.mistingFrequency && (
            <div className="care-item">
              <span>Misting:</span>
              <span>Every {plant.mistingFrequency} days</span>
            </div>
          )}
        </div>
      )}
      
      <AddToCollectionButton plant={plant} />
    </div>
  );
};

const AddToCollectionButton = ({ plant }) => {
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    // This will be implemented in MyPlants component
    setAdding(true);
    // Navigate to My Plants page with plant pre-selected
    setTimeout(() => {
      setAdding(false);
      window.location.href = '/PlantCarePlanner/my-plants?add=' + plant.id;
    }, 500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={adding}
      className="add-plant-btn"
    >
      <Plus size={18} />
      {adding ? 'Adding...' : 'Add to My Plants'}
    </button>
  );
};

export default PlantDatabase;

