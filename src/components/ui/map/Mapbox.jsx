import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import React, { createRef, useRef, useState, useEffect } from 'react';
import MapGL, {
  GeolocateControl,
  NavigationControl,
  Popup,
} from 'react-map-gl';
import { useQuery } from 'react-query';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import Geocoder from 'react-map-gl-geocoder';
import dumyData from '../../../data/cities.json';

import Spinner from '../Spinner';
import Pins from './Pins';
import CityInfo from './CityInfo';

import '../../../stylesheets/map.css';

const apiToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const mapStyle = 'mapbox://styles/supryantowp/ckgfd9g312kjw19pduhgr0n8p';
const baseURL = 'http://parawisely-backend.test/api/travel-place';

const geolocateControlStyle = {
  padding: '20px',
  position: 'absolute',
  right: 0,
};

const NavigationControlStyle = {
  padding: '20px',
  position: 'absolute',
  right: 0,
  top: 40,
};

const fetchTravelplace = async () => {
  const res = await fetch(baseURL);
  return res.json();
};

const Mapbox = ({ width = '100vw', height = '89vh' }) => {
  const { data, status, error } = useQuery('travel-place', fetchTravelplace);

  const [popInfo, setPopInfo] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: -2.68496,
    longitude: 113.95365,
    zoom: 4,
    bearing: 0,
    pitch: 0,
    width,
    height,
  });

  const mapRef = useRef();
  const geocoderRef = createRef();

  useEffect(() => {
    window.removeEventListener('resize', resize);
  }, []);

  const resize = () => {
    handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const handleViewportChange = newVieport => {
    setViewport({ ...viewport, ...newVieport });
  };

  const handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return handleViewportChange({ ...viewport, geocoderDefaultOverrides });
  };

  const handleOnResult = event => {
    setSearchResult(
      new GeoJsonLayer({
        id: 'search-result',
        data: event.result.geomtery,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10,
      })
    );
  };

  const onViewportHandler = viewport => setViewport({ ...viewport });

  const _onClickMarker = city => {
    setPopInfo(city);
  };

  const renderPopup = () => {
    return (
      popInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={parseFloat(popInfo.longitude)}
          latitude={parseFloat(popInfo.latitude)}
          closeOnClick={false}
          onClose={() => setPopInfo(null)}
        >
          <CityInfo info={popInfo} />
        </Popup>
      )
    );
  };

  return (
    <div>
      {status === 'loading' && <Spinner />}

      {status === 'error' && <div>{error}</div>}

      {status === 'success' && (
        <MapGL
          {...viewport}
          mapboxApiAccessToken={apiToken}
          onViewportChange={handleViewportChange}
          ref={mapRef}
          mapStyle={mapStyle}
        >
          <Geocoder
            mapRef={mapRef}
            containerRef={geocoderRef}
            onResult={handleOnResult}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={apiToken}
            position="top-left"
          />

          <Pins data={data.data} onClick={_onClickMarker} />
          <Pins data={dumyData} onClick={_onClickMarker} />
          {renderPopup()}

          <div style={geolocateControlStyle}>
            <GeolocateControl />
          </div>

          <div style={NavigationControlStyle}>
            <NavigationControl />
          </div>
        </MapGL>
      )}
    </div>
  );
};

export default Mapbox;
