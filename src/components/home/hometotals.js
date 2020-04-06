import React from 'react';
import './hometotals.css';

class HomeTotals extends React.Component {
    constructor(props) {
        super(props);
        this.dateScroll = this.dateScroll.bind(this);
    }

    dateScroll = async (e) => {
        console.log(e.type);
        e.persist();
        try{
            await this.props.arrowAction(e.target.id,e.type);       
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return(
            <div className="tables">
                <h2>Totals up to&nbsp;&nbsp;&nbsp;    
                    <button onMouseDown={e=>this.dateScroll(e)} onMouseUp={e=>this.dateScroll(e)} id='left' className='arrowbackground'>
                        &lt;
                    </button>
                    <span className='datespan'>
                        {`${this.props.dayName}, ${this.props.dayDate.toISOString().slice(0,10)}`}
                    </span>
                    <button onMouseDown={e=>this.dateScroll(e)} onMouseUp={e=>this.dateScroll(e)} id='right' className='arrowbackground'>
                        &gt; 
                    </button>
                </h2>
                <table>
                    <thead>
                        <tr key='berrytypesrow'>
                            <th key="row1">Berry Type</th>
                            {this.props.berryTotals.map((item,i )=>
                                <th key={`berrytypescol${i+1}`}>{item.BerryTypeName}</th>
                            )}  
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key="sumberrydayrow">
                            <td key="row2">Day Weight</td>
                            {this.props.berryTotals.map((item,i)=>
                                <td key={`sumberrydaycol${i+1}`}>{item.DayWeight}</td>
                            )}
                        </tr>
                        <tr key="sumberryseasonrow">
                            <td key="row3">Season Weight</td>
                            {this.props.berryTotals.map((item,i)=>
                                <td key={`sumberryseasoncol${i+1}`}>{item.SeasonWeight}</td>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
};

export default HomeTotals;