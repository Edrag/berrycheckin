import React from 'react';



class HomeLast5 extends React.Component {
    constructor(props) {
        super(props);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.modifyEntry = this.modifyEntry.bind(this);
    }

    deleteEntry = async (e) => {
        e.persist();
        try{
            if(window.confirm(`Delete Entry?`)) {
                await this.props.deleteId(e.target.id);
            }       
        } catch (error) {
            console.log(error);
        }
    }
    
    modifyEntry = async (e) => {
        try {
            console.log(`homelast5 ${e.target.id}`);
            await this.props.modifyId(e.target.id);
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return(
            <div className="tables">
                <h2>Last 5 Entries</h2>
                <span className='fillertext'>(Click to Modify)</span>
                <table>
                    <thead>
                        <tr>
                            <th>Date and Time</th>
                            <th>Berry Type</th>
                            <th>Block</th>
                            <th>Variety</th>
                            <th>Grade</th>
                            <th>Batch Num</th>
                            <th>Gross Weight</th>
                            <th># Crates</th>
                            <th>Crate Weight</th>
                            <th>Nett Weight</th>
                            <th>Team</th>
                            <th>Temperature</th>
                            <th>Brix</th>
                            <th>g/Berry</th>
                            <th>Colour</th>
                            <th>Feel</th>
                            <th>Comments</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.berryRecords5.map(item=>
                            <tr key={item.EntryId}>
                                <td>{item.DateTime}</td>
                                <td>{item.BerryType}</td>
                                <td>{item.BlockName}</td>
                                <td>{item.VarietyName}</td>
                                <td>{item.BerryGrade}</td>
                                <td>{item.BatchNum}</td>
                                <td>{item.GrossWeight}</td>
                                <td>{item.NumOfCrates}</td>
                                <td>{item.IndivCrateWeight}</td>
                                <td>{item.NettWeight}</td>
                                <td>{item.Team}</td>
                                <td>{item.Temperature}</td>
                                <td>{item.Brix}</td>
                                <td>{item.GramPerBerry}</td>
                                <td>{item.Colour}</td>
                                <td>{item.Feel}</td>
                                <td>{item.Comments}</td>
                                <td className='actionlast5row' id={item.EntryId} onClick={e=>this.modifyEntry(e)}>Edit</td>
                                <td className='actionlast5row' id={item.EntryId} onClick={e=>this.deleteEntry(e)}>Delete</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    };
};

export default HomeLast5;