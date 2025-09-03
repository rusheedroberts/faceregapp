import React, { Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import ParticlesBg from 'particles-bg';


class App extends Component {
render () {
  return (
    <div className="App">
      <Navigation />     
      <Logo />
      <ImageLinkForm />
      <Rank />
          {/*  <FaceRecognition />*/}

     
    </div>
  );
}
}
export default App;
