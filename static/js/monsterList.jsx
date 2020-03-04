class MonsterCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            room_id: 10,
            initiative: {},
            hp: {},
            damage: {}
    }
    this.rollInit = this.rollInit.bind(this);
    this.dealDamage = this.dealDamage.bind(this);
    this.calculateDamage = this.calculateDamage.bind(this);
  }

    rollInit(evt) {
        const monster_id = evt.target.id;
        console.log("target id: ", monster_id);
        const init_url = '/roll_initiative?monster_id=' + monster_id;
        console.log("we called out this way: ", init_url);
        let response = fetch(init_url);
        response.then((res) => res.json()).then((data) => {
			       console.log('we rolled some initiative, yo: ', data);
             this.setState({initiative: {[monster_id]: data}});
        });
        console.log("state is now: ", this.state);
    }

    dealDamage(evt) {
      const monster_id = evt.target.id;
      console.log("dealDamage called, attempting to update html");
      document.getElementById("damage_fields").innerHTML = "<form name='damage_call' onClick={this.calculateDamage}>How much damage? <input type='number' name='damage' onChange={this.damageHandling}/><br />Which player? <input type='text' name='player' /></form>";
    }

    calculateDamage(evt) {
      evt.preventDefault();
      const monster_id = evt.target.id;
      const damage = this.state.damage[monster_id];
      console.log("monster to hurt: ", monster_id);
      console.log("damage to deal: ", damage);
      const damage_url = "/roll_monster_damage?monster_id=" + monster_id + "&damage=" + damage;
      let response = fetch(damage_url);
      response.then((res) => res.json()).then((data) => {
        console.log("damage done! ", data);
        this.setState({hp: {[monster_id]: data}});
      })
    }

	render() {
		return (
			<div className="monster">
				<h2>Type: {this.props.type}</h2>
				<h2 id="hp">HP: {this.props.hp} </h2>
        <p>Initiative: {this.props.initiative_mod}<br />
        AC: {this.props.ac}<br />
        Hit dice: {this.props.dice_num}d{this.props.dice_type} + {this.props.bonus}</p>
        <table>
            <tbody>
                <tr>
                    <td>STR: {this.props.str}</td><td>DEX: {this.props.dex}</td><td>CON: {this.props.con}</td>
                </tr>
                <tr>
                    <td>INT: {this.props.int}</td><td>WIS: {this.props.wis}</td><td>CHA: {this.props.cha}</td>
                </tr>
            </tbody>
        </table>
        <p>Speed: {this.props.speed} (Swim: {this.props.swim}, Fly: {this.props.fly}, Hover? {this.props.hover})<br />
        Size: {this.props.size}
        </p>
        <p>
          Current Initiative: {this.state.initiative[this.props.monster_id]} <button name="roll_init" type="button" id={this.props.monster_id} onClick={this.rollInit}>Roll Initiative</button><br />
          Current HP: {this.state.hp[this.props.monster_id]} <button id={this.props.monster_id} onClick={this.dealDamage}>Deal Damage</button><br />
        </p>
        <p id="damage_fields">
        </p>
			</div>
		);
	}
}

class MonsterCardContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            monsterCards: []
		}
		this.makeMonsterCards = this.makeMonsterCards.bind(this);
	}

// move to main container at initial call and save the info in state to pass to container for viewing

	makeMonsterCards(monsterData) {
    console.log("we are in the monster land: ", monsterData);
		let monsterCards = [];
    return (
		monsterData.map((currentMonst) => <MonsterCard
          		key={currentMonst.type}
          		monster_id={currentMonst.monster_id}
          	  type={currentMonst.type}
          		hp={currentMonst.hp}
              initiative_mod={currentMonst.initiative_mod}
              ac={currentMonst.ac}
              dice_num={currentMonst.dice_num}
              dice_type={currentMonst.dice_type}
              bonus={currentMonst.bonus}
              str={currentMonst.str}
              dex={currentMonst.dex}
              con={currentMonst.con}
              int={currentMonst.int}
              wis={currentMonst.wis}
              cha={currentMonst.cha}
              speed={currentMonst.speed}
              swim={currentMonst.swim}
              fly={currentMonst.fly}
              hover={currentMonst.hover}
              size={currentMonst.size}
          	/>
//          );
          )
//	    this.setState({ monsterCards: monsterCards });
      );
	}

    render() {
      const monsterData = this.props.monsterList;
      console.log("we are sending: ", monsterData);
      return (
        this.makeMonsterCards(monsterData)
      )
  }
}
