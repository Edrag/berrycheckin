import React from 'react';
import './home.css';
import HomeLast5 from './homelast5';
import HomeTotals from './hometotals';

let intervalTimer
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            berryRecords5:[],
            dayName: 'Today',
            dayDate: new Date(),
            berryTotalsTable:  [],
            direction:''
        }
        this.setDateBox = this.setDateBox.bind(this);
        this.deleteItemFromRecords = this.deleteItemFromRecords.bind(this);
    }

    abortController = new AbortController();
    signal  = this.abortController.signal;  

    async componentDidMount() {
        try {
            await this.getLast5();
            await this.getTotalsTable();
        } catch (error) {
            console.log(error);
        }
    }

    arrowEvent = async (direction, mouseAction) => {
        this.setState({
            direction:direction
        })
        if(mouseAction==='mousedown') {
            this.setDateBox();
            intervalTimer= setInterval(this.setDateBox,200);            
        } else {
            clearInterval(intervalTimer);
            this.getTotalsTable();
        }
    }

    setDateBox = async () => {
        let newDate
        if(this.state.direction==='left') {
            newDate = this.state.dayDate;
            newDate.setDate(newDate.getDate()-1);
            this.setState({
                dayDate: newDate,
                dayName: this.checkDay(newDate)
            })
        } else {
            newDate = this.state.dayDate;
            newDate.setDate(newDate.getDate()+1);
            this.setState({
                dayDate: newDate,
                dayName: this.checkDay(newDate)
            })
        }
    }
    
    getTotalsTable = async () => {
        try {
            let date = this.state.dayDate
            const response = await fetch(`/api_bci/sumday/${date.toISOString().slice(0,10)}`, {signal:this.signal});
            const responseJSON = await response.json();
            //console.log(responseJSON);
            if(response.ok) {
                 this.setState({
                    berryTotalsTable:responseJSON.sumrecords
                 });
                 //console.log(this.state.berryTotalsTable);
            } else {
                throw new Error(response.statusText)
            }
        } catch(error) {
            console.log(error);
        } 
    }
    

    checkDay(newDate) {
        const today = new Date();
        const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        if (today.toISOString().slice(0,10)===newDate.toISOString().slice(0,10)) {
            return 'Today'
        } else {
            return weekday[newDate.getDay()];
        }
    }

    getLast5 = async () => {
        try {

            const response = await fetch(`/api_bci/last5`, {signal:this.signal});
            const responseJSON = await response.json();
            if(response.ok) {
                this.setState({
                    berryRecords5: responseJSON.berryrecords
                });
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
        }        
    }

    deleteItemFromRecords = async (entryId) => {
        try {
            const response = await fetch(`/api_bci/delrecord/${entryId}`, {
                method:'DELETE',
                cache: 'no-cache'
            });
            if(response.ok) {
                alert(`Entry deleted!`);
                this.getLast5();
            }
        } catch (error) {
            console.log(error);
        }
    }

    modifyItemFromRecords = async (entryId) => {
        try {
            console.log(`home ${entryId}`)
            await this.props.id(entryId);
        } catch (error) {
            console.log(error);
        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    };

    render() {
        return(
            <div>
                <div className="homeflexcontainer">
                    <HomeLast5 
                        berryRecords5={this.state.berryRecords5}
                        deleteId={this.deleteItemFromRecords}
                        modifyId={this.modifyItemFromRecords}
                    />
                </div>
                <div className="homeflexcontainer">
                    <HomeTotals                    
                        arrowAction={this.arrowEvent} 
                        dayName={this.state.dayName}
                        dayDate={this.state.dayDate} 
                        berryTotals={this.state.berryTotalsTable}                    
                    />
                </div>
            </div>

        )
    };
};

export default Home;