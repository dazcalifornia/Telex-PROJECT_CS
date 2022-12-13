import React,{
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import {db} from '../../firebase';

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [filteredStations, setFilteredStations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  
  const loadStations = useCallback(async () => {
    try {
      const stationCollection = await db.collection('stations').get();
      const stations = stationCollection.docs.map(doc => {
        const station = doc.data();
        station.id = doc.id;
        return station;
      });
      setStations(stations);
      setFilteredStations(stations);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  }, []);
}
export default Stations;



