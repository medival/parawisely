import './stylesheets/html.css';

import React, { useEffect } from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import theme from './theme';

import Landing from './pages/Landing';
import Kontak from './pages/Kontak';
import Tentang from './pages/Tentang';
import Eksplor from './pages/Eksplor';
import EksplorCategory from './pages/EksplorCategory';
import WisataDaerah from './pages/WisataDaerah';
import Map from './pages/Map';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <Switch>
          <Route path="/peta-wisata" component={Map} />
          <Route path="/eksplorasi/:category" component={EksplorCategory} />
          <Route path="/eksplorasi" component={Eksplor} />
          <Route path="/wisata-daerah" component={WisataDaerah} />
          <Route path="/kontak" component={Kontak} />
          <Route path="/tentang" component={Tentang} />
          <Route path="/mitra-pariwisata" component={Eksplor} />
          <Route path="/rekomendasi" component={Eksplor} />
          <Route path="/" component={Landing} exact />
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
