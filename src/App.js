import React, { Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import './App.css';



const returnClarifaiRequestOptions = (imageUrl) => {
const PAT = 'b17a70bd7be345a0998e6525aabe1b6b';

const USER_ID = 'rusheedroberts';
const APP_ID = 'face';
const IMAGE_URL = imageUrl;

const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                    
                }
            }
        }
    ]
});

 const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};
return requestOptions
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl: '',
       box: {},
       route: 'signin',
       isSignedIn: false
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
    
    // fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(this.state.input))
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifaiRequestOptions(this.state.input))

    .then(response => response.json())
    .then(result => {
    const regions = result.outputs[0].data.regions;

    regions.forEach(region => {
      const boundingBox = region.region_info.bounding_box;
      const topRow = boundingBox.top_row.toFixed(3);
      const leftCol = boundingBox.left_col.toFixed(3);
      const bottomRow = boundingBox.bottom_row.toFixed(3);
      const rightCol = boundingBox.right_col.toFixed(3);

      region.data.concepts.forEach(concept => {
        const name = concept.name;
        const value = concept.value.toFixed(4);
        console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
      });
    });

    this.displayFaceBox(this.calculateFaceLocation(result));
  })
  .catch(err => console.log('error', err));

      
      }

      onRouteChange = (route) => {
        if (route === 'signout'){
          this.setState({isSignedIn: false})
        } else if (route === 'home'){
          this.setState({isSignedIn: true})
        }
        this.setState({route: route});
      }

render () {
 const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
      <ParticlesBg 
        className='particles' 
        type="cobweb" 
        bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} /> 
      { route === 'home' 
        
        ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}  
              />      
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>

         : (  route === 'signin'
             ? <Signin onRouteChange={this.onRouteChange}/>
             : <Register onRouteChange={this.onRouteChange}/> 
             )
  }

    </div>
  );
}
}

export default App;
