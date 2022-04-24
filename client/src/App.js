import React, { Component } from "react";
import ItemManager from "./contracts/ItemManager.json";
import Item from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  //state = { storageValue: 0, web3: null, accounts: null, contract: null };
  state = { cost: 0, itemName: "exampleItem1", loaded: false };


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      console.log(ItemManager.networks[networkId].address);

      console.log(web3);
      this.itemManager =  new web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[networkId].address,
      );
      this.item =  new web3.eth.Contract(
        Item.abi,
        Item.networks[networkId] && Item.networks[networkId].address,
      );
      this.setState({ loaded: true });



    } catch (error) {
      console.log(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };



  handleSubmit = async () => {
    const { cost, itemName } = this.state;
    console.log(itemName, cost, this.itemManager);
    console.log(this.accounts); 
    let result = await this.itemManager.methods.createItem(itemName, cost).send({from:this.accounts[0]});
    console.log(result);
    console.log(result.events.SupplyChainStep.returnValues);

    alert("Send " + cost + " Wei to " + result.events.SupplyChainStep.returnValues._itemAddress);
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Simply Payment/Supply Chain Example!</h1>
        <h2>Items</h2>
        <h2>Add Element</h2>
        Cost: <input type="text" name="cost" value={this.state.cost} onChange={this.handleInputChange} />
        Item Name: <input type="text" name="itemName" value={this.state.itemName} onChange
          ={this.handleInputChange} />
        <button type="button" onClick={this.handleSubmit}>Create new Item</button>
      </div>
    );
  }
}

export default App;
