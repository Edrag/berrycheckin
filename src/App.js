import React from 'react';
import './App.css';
import Form from './components/form/form.js';
import Menu from './components/menu/menu';
import Home from './components/home/home';
import Logo from './BdW_logo_pruple_50.png';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      showPage: [1,0,0,0],
      entryId: undefined
    };
    this.togglePage = this.togglePage.bind(this);
  };

  home = () => {
    window.location.href='/';
  };

  togglePage(clickedPage) {
    console.log(this.state.showPage);
    switch (parseInt(clickedPage)) {
      case 0:
        this.setState({showPage:[1,0,0,0]});
        break;
      case 1:
        this.setState({showPage:[this.state.showPage[0]?1:0,this.state.showPage[1]?0:1,0,this.state.showPage[3]?1:0]});
        break;
      case 2:
        this.setState({showPage:[this.state.showPage[0]?1:0,0,this.state.showPage[2]?0:1,this.state.showPage[3]?1:0]});
        break;
      case 3:
        this.setState({showPage:[0,0,0,1]});
        break;
      default:
        this.setState({showPage:[1,0,0,0]});
    }
  }

  setEntryIdForModify = async (id)=> {
    try {
      this.setState({
        entryId: id
      });
      this.togglePage(1)
      
    } catch (error) {
      console.log(error)
    }
  }

  clearEntryId = async () => {
    try {
      this.setState({
        entryId: undefined
      });
    } catch (error) {
      console.log(error);
    }
  }

  formCancelButtonClick = async () => {
    try {
      this.togglePage(1);
      this.clearEntryId();
    } catch(error) {
      console.log(error);
    }
  }

  render() {  
    return (
      <div className="App">
        <div className="logoDiv">
          <img src={Logo} className="logo" alt="BdW Logo" onClick={this.home}/>
        </div>
          <Menu onClick={this.togglePage} />      
        <div className="bodyDiv">
          {this.state.showPage[0]? <Home id={this.setEntryIdForModify}/>:null}
          {this.state.showPage[1] ? <Form id={this.state.entryId} clearId={this.clearEntryId} cancelClick={this.formCancelButtonClick}/> : null }
        </div>        
      </div>
    );
  }
}

export default App;
