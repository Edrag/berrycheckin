import React from 'react';
import DatePicker from 'react-datepicker';
import "./react-datepicker.css";
import './form.css';

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            numCrate:0,
            grossWeight:0,
            crateWeight:0.92,
            nettWeight:0,
            berryTypeSelectedNum:"",
            blockSelectedName: "",
            blockSelectedNum:"",
            varietySelectedName:"",
            varietySelectedNum:"",
            berryTypes: [],
            blockNames:[],
            varietyNames:[],
            startDate: new Date(),
            berryRecord:[]
        };
        this.handleParamChange = this.handleParamChange.bind(this);
        this.updateNWeight = this.updateNWeight.bind(this);
        this.handleBerryTypeChange = this.handleBerryTypeChange.bind(this);
    };

    abortController = new AbortController();
    signal  = this.abortController.signal;  

    getBerryType = async () => {
        try {
            console.log(`Execute Berry Type Change`);
            const response = await fetch("/api_bci/berrytypes", {signal:this.signal});
            const responseJSON = await response.json();
            if (response.ok) {
                this.setState({
                    berryTypes:responseJSON.berryTypes,
                    berryTypeSelectedNum: responseJSON.berryTypes[0].BerryTypeNumber
                });
                console.log(`Berry Types:${this.state.berryTypes}
                            Selected Berry Type Num:${this.state.berryTypeSelectedNum}`);
            } else {
                throw new Error(response.statusText);
            }
        }catch (error) {
            console.log(error);
        }
    };

    getBlocks = async () => {
        try {
            const response = await fetch(`/api_bci/blocks/${this.state.berryTypeSelectedNum}`,{signal:this.signal});
            const responseJSON = await response.json();
            if (response.ok) {
                console.log(this.state.blockNames);
                this.setState({
                    blockNames: responseJSON.berryBlocks,
                    blockSelectedNum: responseJSON.berryBlocks[0].BlockNumber,
                    blockSelectedName: responseJSON.berryBlocks[0].BlockName
                });
                console.log(`Block Object:${this.state.blockNames}
                            Selected Block Name:${this.state.blockSelectedName}
                            Selected Block Num:${this.state.blockSelectedNum}`);               
            } else {
                throw new Error(response.statusText);
            }
        } catch(error) {
            console.log(error);
        }
    };

    getVarieties = async () => {
        try {
            const response = await fetch(`/api_bci/varieties/${this.state.blockSelectedNum}/${this.state.berryTypeSelectedNum}`, {signal:this.signal});
            const responseJSON = await response.json();
            if(response.ok) {
                this.setState({
                    varietyNames: responseJSON.berryVarieties,
                    varietySelectedNum:responseJSON.berryVarieties[0].BerryVarietyId,
                    varietySelectedName:responseJSON.berryVarieties[0].BerryVarietyName
                });
                console.log(`Variety Object:${this.state.varietyNames}
                            Selected Variety Name:${this.state.varietySelectedName}
                            Selected Variety Num:${this.state.varietySelectedNum}`);  
            } else {
                throw new Error(response.statusText);
            }
        } catch(error){
            console.log(error);
        }

    };

    async componentDidMount() {
        try {
            await this.getBerryType();
            await this.getBlocks();
            await this.getVarieties();
            if(this.props.id) {
                this.retrieveRecordForForm(this.props.id);
            }
        }catch(error){
            console.log(error);
        }
    };

    retrieveRecordForForm = async (id) => {
        try {
            const response = await fetch(`/api_bci/record/${id}`,{signal:this.signal});
            const responseJSON = await response.json();
            await this.setState({
                startDate: new Date(responseJSON.DateTime),
                numCrate: parseFloat(responseJSON.NumOfCrates),
                grossWeight:parseFloat(responseJSON.GrossWeight),
                crateWeight:parseFloat(responseJSON.IndivCrateWeight),
                nettWeight:parseFloat(responseJSON.NettWeight),
                berryTypeSelectedNum: responseJSON.BerryTypeNumber
            })
            document.getElementById("entryid").value = responseJSON.EntryId;
            document.getElementById("berrytype").value = responseJSON.BerryTypeNumber;
            await this.getBlocks();
            await this.setState({
                blockSelectedNum: responseJSON.BerryBlockNumber
            })
            document.getElementById("blockid").value = responseJSON.BerryBlockNumber;
            await this.getVarieties();
            document.getElementById("varietyid").value = responseJSON.BerryVarietyNumber;
            document.getElementById("berrygrade").value = responseJSON.BerryGrade;
            document.getElementById("batchnum").value = responseJSON.BatchNum;
            document.getElementById("qcteam").value = responseJSON.Team;
            document.getElementById("qctemp").value = responseJSON.Temperature;
            document.getElementById("qcbrix").value = responseJSON.Brix;
            document.getElementById("qcgpberry").value = responseJSON.GramPerBerry;
            document.getElementById("qccolour").value = responseJSON.Colour;
            document.getElementById("qcfeel").value = responseJSON.Feel;
            document.getElementById("qccomments").value = responseJSON.Comments;
        } catch (error) {
            console.log(error);
        }
    }

    handleParamChange(event) {
        const id = event.target.name;
        switch (id) {
            case 'numofcrates':
                this.setState({
                    numCrate:parseFloat(event.target.value)                    
                }, ()=>this.updateNWeight());
                break;
            case 'grossweight':
                this.setState({
                    grossWeight: parseFloat(event.target.value)
                }, ()=>this.updateNWeight());
                break;
            case 'crateindividualweight':
                this.setState({
                    crateWeight: parseFloat(event.target.value)
                }, ()=>this.updateNWeight());
                break;
            default:
                console.log("No name passed");
        }
    };
    updateNWeight() {
        //console.log(this.state.grossWeight,this.state.numCrate,this.state.crateWeight);
        const nWeight = (this.state.grossWeight-(this.state.numCrate*this.state.crateWeight)).toFixed(2)

        this.setState({
            nettWeight:nWeight>0?nWeight:0
        });
        //console.log(this.state.nettWeight);
    };

    async handleBerryTypeChange(event) {
        try {
            console.log(`handleBerryTypeChange event target id ${event.target.value}`);
            await this.setState({
                berryTypeSelectedNum:event.target.value
            });
            console.log(`handleBerryTypeChange after state update ${this.state.berryTypeSelectedNum}`);
            await this.getBlocks();
            await this.getVarieties();
        } catch (error) {
            console.log(error);
        }
    };

    async handleBlockChange(event) {
        try {
            await this.setState({
                blockSelectedName:event.target[event.target.selectedIndex].text,
                blockSelectedNum:event.target.value
            });
            await this.getVarieties();
        } catch(error) {
            console.log(error);
        }
    };

    handleDateChange = date => {
        this.setState({
            startDate: date
        });
    };

    /*formValidation = () => {
        document.forms["berryform"].elements.(el => {
            console.log(el);
            if(el.tagName==="INPUT" || el.tagName==="SELECT" || el.tagName==="TEXTAREA") {
                console.log(`inside if`);
            }
        });
    };*/

    componentWillUnmount() {
        this.abortController.abort();
        this.props.clearId();
    }

    handleSubmitClick = async (e) => {
        try {
            e.preventDefault();
            if (this.props.id) {
                document.getElementById('berryform').action = '/api_bci/post/record';
            }
            //this.formValidation();
            document.getElementById('berryform').submit();
            this.props.clearId();
        } catch (error) {
            console.log(error);
        }
    }

    handleCancelClick = async () => {
        try {
            this.props.cancelClick();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className="form">
                <form id="berryform" method="POST" action="/api_bci/post/formsubmit">
                    <h3>Date and Time</h3>
                    <input type="hidden" id="entryid" name="entryid" value={this.props.id}></input>
                    <ul id="dateandtime" className="flexcontainer">
                        <li>
                            <label htmlFor="date">Date and Time</label>
                            <DatePicker
                                id="datetime"
                                name="datetime"
                                value={this.state.startDate}
                                dateFormat="yyyy-MM-dd HH:mm"
                                selected={this.state.startDate}
                                onChange={this.handleDateChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                            />
                        </li>
                    </ul>
                    <h3>Berries</h3>
                    <ul id="berryinfo" className="flexcontainer identities">
                        <li>
                            <label htmlFor="berrytype">Berry Type</label>
                            <select id="berrytype" name = "berrytype" onChange={e=>this.handleBerryTypeChange(e)}>
                                {this.state.berryTypes.map((id,num)=><option key={`type${id.BerryTypeNumber}`} value={id.BerryTypeNumber}>{id.BerryTypeName}</option>)}
                            </select>
                        </li>
                        <li>
                            <label htmlFor="blockid">Block Name</label>
                            <select id="blockid" name="blockid" onChange={e=>this.handleBlockChange(e)}>
                                {this.state.blockNames.map((id,val)=><option key={`type${id.BlockNumber}`} value={id.BlockNumber}>{id.BlockName}</option>)}
                            </select>
                        </li>
                        <li>
                            <label htmlFor="variety">Variety</label>
                            <select id="varietyid" name="varietyid">
                                {this.state.varietyNames.map((id,val)=><option key={`type${id.BerryVarietyId}`} value={id.BerryVarietyId}>{id.BerryVarietyName}</option>)}
                            </select>
                        </li>
                        <li>
                            <label htmlFor="berrygrade">Grading</label>
                            <select id="berrygrade" name="berrygrade">
                                <option key="1stGrade" value="1">1st Grade</option>
                                <option key="2ndGrade" value="2">2nd Grade</option>
                                <option key="3rdGrade" value="3">3rd Grade</option>
                            </select>
                        </li>
                        <li>
                            <label htmlFor="batchnum">Batch Num</label>
                            <input id="batchnum" name="batchnum" type="text"></input>
                        </li>
                    </ul>
                    <h3>Quantities</h3>
                    <ul id="berryqty" className="flexcontainer quantities">
                        <li>
                            <label htmlFor="numofcrates"># Crates</label>
                            <input onChange={(e)=>this.handleParamChange(e)} type="number" min="0" id="numofcrates" name="numofcrates" value={this.state.numCrate}></input>
                        </li>
                        <li>
                            <label htmlFor="grossweight">Scale weight(kg)</label>
                            <input onChange={(e)=>this.handleParamChange(e)} type="number" min="0" id="grossweight" name="grossweight" value={this.state.grossWeight}></input>
                        </li>
                        <li>
                            <label htmlFor="crateindividualweight">One crate(kg)</label>
                            <input onChange={(e)=>this.handleParamChange(e)} type="number" step="0.01" min="0" id="crateindividualweight" name="crateindividualweight" value={this.state.crateWeight}></input>
                        </li>
                        <li>
                            <label htmlFor="nettweight">Nett weight (kg)</label>
                            <input type="number" id="nettweight" name="nettweight" min="0" readOnly value={this.state.nettWeight}></input>
                        </li>
                    </ul>
                    <h3>QC</h3>
                    <ul id="berryQC" className="flexcontainer qualitycontrols">
                        <li>
                            <label htmlFor="qcteam">Team</label>
                            <input id="qcteam" name="qcteam" type="text"></input>
                        </li>
                        <li>
                            <label htmlFor="qctemp">Temperature</label>
                            <input type="number" step="0.5" id="qctemp" name="qctemp"></input>
                        </li>
                        <li>
                            <label htmlFor="qcbrix">Brix</label>
                            <input type="number" step="0.2" id="qcbrix" name="qcbrix" min="0"></input>
                        </li>
                        <li>
                            <label htmlFor="qcgpberry">Gram per Berry</label>
                            <input type="number" step="1" id="qcgpberry" name="qcgpberry" min="0"></input>
                        </li>
                        <li>
                            <label htmlFor="qccolour">Colour</label>
                            <select id="qccolour" name="qccolour">
                                <option key="lightred" value="lightred">Light Red</option>
                                <option key="fullred" value="fullred">Full Red</option>
                                <option key="darkred" value="darkred">Dark Red</option>
                                <option key="fullblack" value="fullblack">Full Black</option>
                                <option key="spottedblack" value="spottedblack">Spotted Black</option>
                                <option key="purple" value="purple">Purple</option>
                                <option key="yellow" value="yellow">Yellow</option>
                                <option key="green" value="green">Green</option>
                                <option key="fullblue" value="fullblue">Full Blue</option>
                                <option key="lightblue" value="lightblue">Light Blue</option>
                                <option key="darkblue" value="darkblue">Dark Blue</option>
                            </select>
                        </li>
                        <li>
                            <label htmlFor="qcfeel">Feel</label>
                            <select id="qcfeel" name="qcfeel">
                                <option key="soggy" value="soggy">Soggy</option>
                                <option key="soft" value="soft">Soft</option>
                                <option id="firm" value="firm">Firm</option>
                                <option id="hard" value="hard">Hard</option>
                            </select>
                        </li>
                    </ul>
                    <div className="flexcontainer qccomments">
                            <label htmlFor="qccomments">Comments</label>
                            <textarea id="qccomments" name="qccomments" placeholder="Kommentaar oor ontvangs hier asseblief"></textarea>
                    </div>
                    <div>
                        <ul className="flexcontainer formbuttons">
                            <input type="submit" onClick={(e)=>this.handleSubmitClick(e)}></input>
                            <button type="button" onClick={(e)=>this.handleCancelClick(e)}>Cancel</button>
                        </ul>
                    </div>
                </form>

            </div>

        );
    };
}

export default Form;