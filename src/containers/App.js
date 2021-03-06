import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Logo from '../components/Logo/Logo';
import ColorRecognition from '../components/ColorRecognition/ColorRecognition';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Footer from '../components/Footer/Footer';
import './App.css';

const app = new Clarifai.App({
    apiKey: 'e396a86b60c34a468d8a854ac9c383a6'
});

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            tooltipVisible: false,
            colorRecAppreance: false,
            colors: [],
            footerBgColor: '#BABABA' 
        }
    }

    onInputChangeHandler = (event) => {
        this.setState({input: event.target.value})

        if(event.target.value === "") {
            this.setState({colorRecAppreance: false})
        }
    }

    displayColors = (colors) => {
        const rawColorsData = colors.outputs[0].data.colors;
        const hexaColors = rawColorsData.map((color) => {
            return color.raw_hex;
       });

       this.setState({colors: hexaColors});
    }

    /*validate_is_image = (url, callback, errorcallback) => {
        const img = new Image();

        if (typeof(errorcallback) === "function") {
            img.onerror = () => { errorcallback(); }
        } else {
            img.onerror = () => { return false; }
        }

        if (typeof(callback) === "function") {
            img.onload = () => { callback(); }
        } else {
            img.onload = () => { return true; }
        }

        img.src = url;
    }*/

    onSubmitHandler = () => {
        app.models
        .predict(Clarifai.COLOR_MODEL, this.state.input)
        .then(response => this.displayColors(response))
        .catch(err => console.log(err));

        if(this.state.input !== "") {
            this.setState({
                imageUrl: this.state.input,
                colorRecAppreance: true
            });
        }

        //let url = this.state.imageUrl;

        /*this.validate_is_image(url, 
                function(){ 
                    this.setState({tooltipVisible: false})
            }, function(){ 
                    this.setState({tooltipVisible: true})
        });*/
    }

    footerBgHandler = () => {
        if(this.state.footerBgColor === "#BABABA") {
            this.setState({
               footerBgColor: "#787878"
            })
        } else {
            this.setState({
               footerBgColor: "#BABABA"
            })
        }
    }

    render() {
        return (
            <div className="App">
                <div className="container-fluid">
                    <div className="container input-section">
                        <Logo />
                        <ImageLinkForm 
                          changed={this.onInputChangeHandler}
                          submitted={this.onSubmitHandler.bind(this)}
                          tooltipVisible={this.state.tooltipVisible}
                        />
                        
                    </div>
                    <div className={"container-hidden" + (this.state.colorRecAppreance === true ? " container-visible" : "")}>
                        <ColorRecognition 
                            colorRecApp={this.state.colorRecAppreance}
                            colors={this.state.colors}
                            box={this.state.box} 
                            imageUrl={this.state.imageUrl}
                        />
                    </div>
                </div>    
                <Footer
                    footerBgColor={this.state.footerBgColor}
                    footerBgChanged={this.footerBgHandler} 
                />
            </div>
        );
    }
}

export default App;
