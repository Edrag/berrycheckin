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
                    <button onPointerDown={e=>this.dateScroll(e)} onPointerUp={e=>this.dateScroll(e)} id='left' className='arrowbackground'>
                        &lt;
                    </button>
                    <span className='datespan'>
                        {`${this.props.dayName}, ${this.props.dayDate.toISOString().slice(0,10)}`}
                    </span>
                    <button onPointerDown={e=>this.dateScroll(e)} onPointerUp={e=>this.dateScroll(e)} id='right' className='arrowbackground'>
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr key="sumberrydayrowclass1">
                            <td key="row2">Class 1 Day Weight</td>
                            {this.props.berryTotals.map((item,i)=>
                                <td key={`sumberryday1col${i+1}`}>{item.DayWeightClass1}</td>
                            )}
                        </tr>
                        <tr key="sumberrydayrowclass2">
                            <td key="row3">Class 2 & 3 Day Weight</td>
                            {this.props.berryTotals.map((item,i)=>
                                <td key={`sumberryday2col${i+1}`}>{item.DayWeightClassOther}</td>
                            )}
                        </tr>
                        <tr key="sumberryseasonrow">
                            <td key="row4">Season Weight</td>
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