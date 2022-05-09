import React, { Component, useState } from 'react';
import {ReactComponent as DownArrow} from './icons/down-arrow.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <MultiSelect/>
        </div>
      </header>
    </div>
  );
}

class MultiSelect extends Component {
  constructor(props){
    super(props);
    this.selectItem = this.selectItem.bind(this);
    this.selectAllItems = this.selectAllItems.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
    this.changeDropdownCondition = this.changeDropdownCondition.bind(this);
    this.state = {
      groups: {
        "Group1": [
          ["Asset1", "Description1", false],
          ["Asset2", "", false],
          ["Asset3", "Description2", false]
        ],
        "Group2": [
          ["Asset4", "", false],
          ["Asset12", "", false]
        ]
      },
      selectedItems: [],
      searchBar: "",
      dropdownCondition: "DropdownMenuDivHidden"
    }
  }

  changeDropdownCondition() {
    if(this.state.dropdownCondition === "DropdownMenuDivHidden"){
      this.setState({dropdownCondition: "DropdownMenuDiv"});
    }else{
      this.setState({dropdownCondition: "DropdownMenuDivHidden"});
    }
    
  }

  changeSearch(e) {
    this.setState({searchBar: e.target.value});
  }

  selectItem(name, toggle) {
    let items;
    let groups = Object.entries(this.state.groups);
    let newGroups = {};
    for(let i = 0; i < groups.length; ++i){
      let temp = []
      for(let j = 0; j < groups[i][1].length; ++j){
        if(groups[i][1][j][0] === name) groups[i][1][j][2] = toggle;
        temp.push(groups[i][1][j]);
      }
      newGroups[groups[i][0]] = temp;
    }
    if(toggle){
      items = [...this.state.selectedItems];
      items.push(name);
      this.setState({groups: newGroups, selectedItems: items})
    }else{
      items = [...this.state.selectedItems];
      for(let i = 0; i < items.length; ++i){
        if(items[i] === name) items.splice(i,1);
      }
      this.setState({groups: newGroups, selectedItems: items})
    }
  }
  selectAllItems(toggle) {
    let items = [];
    let groups = [];
    let newGroups = {};
    groups = Object.entries(this.state.groups);
    for(let i = 0; i < groups.length; ++i){
      let temp = []
      for(let j = 0; j < groups[i][1].length; ++j){
        items.push(groups[i][1][j][0]);
        groups[i][1][j][2] = toggle;
        temp.push(groups[i][1][j]);
      }
      newGroups[groups[i][0]] = temp;
    }
    if(toggle){
      this.setState({groups: newGroups, selectedItems: items})
    }else{
      this.setState({groups: newGroups, selectedItems: []})
    }
  }


  render() {
    // Search bar filter
    const groupsToBeSent = {}
    let groups = Object.entries(this.state.groups);
    for(let i = 0; i < groups.length; ++i){
      let temp = [];
      for(let j = 0; j < groups[i][1].length; ++j){
        if(groups[i][1][j][0].substring(0, this.state.searchBar.length) === this.state.searchBar){
          temp.push(groups[i][1][j]);
        }
      }
      if(temp.length !== 0) groupsToBeSent[groups[i][0]] = temp;
    }



    return (
      <div className="MultiSelectDiv">
        <ResultBar 
          changeDropdownCondition={this.changeDropdownCondition}
          changeSearch={this.changeSearch} 
          selectItem={this.selectItem} 
          selectedItems={this.state.selectedItems}/>
        <DropdownMenu 
          dropdownCondition={this.state.dropdownCondition}
          groups={groupsToBeSent}
          selectItem={this.selectItem}
          selectAllItems={this.selectAllItems}
          checked={this.state.selectedItems.length !== 0}/>
      </div>
    );
  }
}


class ResultBar extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.changeSearch(e);
  }

  render() {
    const btns = [];
    for(let i = this.props.selectedItems.length-1; i >= 0; --i){
      btns.push(<div key={i} className="SelectionDiv">
        <button 
          onClick={() => this.props.selectItem(this.props.selectedItems[i],false)} 
          className="resultBarSelectionBtn">X</button>
        {this.props.selectedItems[i]}
      </div>
      )
    }
    
    let selectionsDiv;
    if(this.props.selectedItems.length > 0){
      selectionsDiv = (
        <div className="SelectionsDiv">
          {btns}
        </div>
      )
    }


    return(
      <div className="ResultBarDiv">
        {selectionsDiv}
        <input className="ResultBarInput" onChange={(e) => this.handleChange(e)} placeholder='Search Assets: '></input>
        <DownArrow className="ResultBarButton" onClick={this.props.changeDropdownCondition}></DownArrow>
      </div>
    )
  }
}


class DropdownMenu extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {toggle: true}
  }

  handleChange(toggle) {
    this.props.selectAllItems(toggle);
    this.setState({toggle: !toggle});
  }


  render () {
    const groupRenderer = [];
    const groups = Object.entries(this.props.groups);
    for(let i = 0; i < groups.length; ++i){
      groupRenderer.push(<MenuGroup key={i} selectItem={this.props.selectItem} name={groups[i][0]} items={groups[i][1]}/>)
    }
    return (
      <div className={this.props.dropdownCondition}>
      <div>
        <input type="checkbox" checked={!this.state.toggle} onChange={(e) => this.handleChange(this.state.toggle)}></input>
        <label>Select All</label>
      </div>
      <div className="GroupDiv">
        {groupRenderer}
      </div>
    </div>
    )
  }
}

function MenuGroup(props) {
  const itemRenderer = [];
  for(let i = 0; i < props.items.length; ++i){
    itemRenderer.push(<MenuItem 
      key={i} 
      selectItem={props.selectItem} 
      name={props.items[i][0]} 
      desc={props.items[i][1]}
      checked={props.items[i][2]}/>)
  }
  return (
    <div className="MenuGroupDiv">
      <label>{props.name}</label>
      {itemRenderer}
    </div>
  )
}

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    this.props.selectItem(this.props.name, !this.props.checked);
  }

  render() {
    return (
      <div className="MenuItemDiv">
        <div className="inputAndNameDiv">
          <input 
            type="checkbox" 
            checked={this.props.checked} 
            onChange={(e) => this.handleChange()}
            className="itemCheckBox"></input>
          <span className="itemName">{this.props.name}</span>
        </div>
        <div className="itemDescription">
          <span>{this.props.desc}</span>
        </div>
      </div>
    )
  }
}



export default App;
