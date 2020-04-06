import React from 'react';
import './menu.css';


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    };

    handleClick(e) {
        this.props.onClick(e.target.value)
    }

    render() {
        return(
            <div>
                <button className="topmenubutton" onClick={this.handleClick} value="0">Home</button>
                <button className="topmenubutton" onClick={this.handleClick} value="1">Receive Berries</button>
                <button className="topmenubutton" onClick={this.handleClick} value="2">Modify Data</button>
                <button className="topmenubutton" onClick={this.handleClick} value="3">Longterm History</button>
            </div>
        );
    }
};

export default Menu;