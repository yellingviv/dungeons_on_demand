class MonsterCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            room_id: 10,
            initiative: {},
            hp: {},
            damage: {},
            hit_roll: {},
            attack: {},
            crit: {}
    }
    this.rollInit = this.rollInit.bind(this);
    this.dealDamage = this.dealDamage.bind(this);
    this.rollToHit = this.rollToHit.bind(this);
    this.rollToDamage = this.rollToDamage.bind(this);
    this.damageHandling = this.damageHandling.bind(this);
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

    rollToHit(evt) {
      const monster_id = evt.target.id;
      const min = Math.ceil(1);
      const max = Math.floor(21);
      const roll = Math.floor(Math.random() * (max - min)) + min;
      this.setState({hit_roll: {[monster_id]: roll}});
    }

    rollToDamage(evt) {
      const monster_id = evt.target.id;
      if (this.state.hit_roll[monster_id]) {
        this.setState({crit: {[monster_id]: true}});
      }
      const crit = this.state.crit[monster_id];
      console.log("is this a crit? ", crit);
      const attack_url = '/roll_monster_attack?monster_id=' + monster_id + "?crit=" + crit;
      let response = fetch(attack_url);
      response.then((res) => res.json()).then((data) => {
        console.log("we got back a roll: ", data);
        this.setState({attack: {[monster_id]: data}});
      });
      console.log("state is now: ", this.state);
    }

    damageHandling(evt) {
      this.setState({damage: {[evt.target.id]: evt.target.value}});
    }

    dealDamage(evt) {
      evt.preventDefault();
      const monster_id = evt.target.id;
      console.log("this is our current state: ", this.state.damage);
      const damage = this.state.damage[monster_id];
      console.log("okay this is where we are: ", this.state.hp[monster_id]);
      let current_hp = 10;
      if (!this.state.hp[monster_id]) {
        current_hp = 0;
        console.log("we tried to set it to zero?");
      } else {
        current_hp = this.state.hp[monster_id];
        console.log("we set the hp to the current state");
      }
      console.log("this is the hp coming out of this: ", current_hp)
      console.log("damage to deal: ", damage);
      const damage_url = "/roll_monster_damage?monster_id=" + monster_id + "&damage=" + damage + "&hp=" + current_hp;
      let response = fetch(damage_url);
      response.then((res) => res.json()).then((data) => {
        console.log("damage done! ", data);
        if (data === "dead") {
          this.setState({hp: {[monster_id]: 0}});
          document.getElementById("damage_fields").innerHTML = "Monster defeated!!"
        } else {
          this.setState({hp: {[monster_id]: data}});
          console.log("updated: ", this.state.hp[monster_id]);
        }
        this.setState({damage: {[monster_id]: ''}});
      })
    }

	render() {
		return (
			<div className="monster">
				<h2>Type: {this.props.type}</h2>
				<h2 id="hp">Total HP: {this.props.hp} </h2>
        <p>Initiative: {this.props.initiative_mod}<br />
        AC: {this.props.ac}<br />
        Hit dice: {this.props.dice_num}d{this.props.dice_type} + {this.props.bonus} <br />
        <button id={this.props.monster_id} onClick={this.rollToHit}>Roll To Hit</button> {this.state.hit_roll[this.props.monster_id]} <br />
        <button id={this.props.monster_id} onClick={this.rollToDamage}>Roll for Damage</button> {this.state.attack[this.props.monster_id]}</p>
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
          Current HP: {this.state.hp[this.props.monster_id]} <br />
        </p>
          <form onSubmit={this.dealDamage} id={this.props.monster_id}>
          Damage dealt: <input type='number' onChange={this.damageHandling} id={this.props.monster_id} name='damage' value={this.state.damage[this.props.monster_id]}/><br />
          Attacking player: <input type='text' name='player' /><br />
          <input type='submit' value='Deal Damage' /></form>
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
		let monsterCards = [];
    return (
		monsterData.map((currentMonst) =>
          <MonsterCard
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
          )
      );
	}

    render() {
      const monsterData = this.props.monsterList;
      return (
        this.makeMonsterCards(monsterData)
      )
  }
}
