import React, { Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
// import Clarifai from 'clarifai';
import './App.css';


// const app = new Clarifai.App({
//   apiKey: '6ef5676d3f414b2094af6d7791bfc9e3'
// });



// const particlesOptions = {
//   particles: {
//     number: {
//       value :50,
//       density: {
//         enable:true,
//         value_area:800
//       }
//     }
//   }
// }

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl: '',
       box: {},
       route: 'signin',
    }
  }

   calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
   }

    displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState ({imageUrl: this.state.input});
    // app.models
    //   .predict(
    //     Clarifai.FACE_DETECT_MODEL,
    //     this.state.input)
    //     .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    //       .catch(err => console.log(err));
      
      }

render () {
  return (
    <div className="App">
      <ParticlesBg 
        className='particles' 
        // params ={particlesOptions} 
        type="cobweb" 
        bg={true} />
      <Navigation /> 
      { this.state.route === 'signin' 
        ? <Signin />  
        : <div>
         <Logo />
      <Rank />
      <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}  />      
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
    </div>
}
      : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )

     
    </div>
  );
}
}
export default App;
