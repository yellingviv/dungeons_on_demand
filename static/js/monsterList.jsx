class MonsterCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room_id: 10,
            initiative: {},
            hp: {},
            damage: {},
            player_attacking: {},
            hit_roll: {},
            attack: {},
            crit: {}
        }
        this.dealDamage = this.dealDamage.bind(this);
        this.rollToHit = this.rollToHit.bind(this);
        this.rollToDamage = this.rollToDamage.bind(this);
        this.damageHandling = this.damageHandling.bind(this);
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
        const attack_url = '/roll_monster_attack?monster_id=' + monster_id + "&crit=" + crit;
        let response = fetch(attack_url);
        response.then((res) => res.json()).then((data) => {
            this.setState({attack: {[monster_id]: data}});
        });
    }

    damageHandling(evt) {
        this.setState({[evt.target.name]: {[evt.target.id]: evt.target.value}});
    }

    dealDamage(evt) {
        evt.preventDefault();
        const monster_id = evt.target.id;
        const damage = this.state.damage[monster_id];
        const player = this.state.player_attacking[monster_id];
        let current_hp = 10;
        if (!this.state.hp[monster_id]) {
            current_hp = 0;
        } else {
            current_hp = this.state.hp[monster_id];
        }
        const damage_url = "/roll_monster_damage?monster_id=" + monster_id + "&damage=" + damage + "&hp=" + current_hp;
        let response = fetch(damage_url);
        response.then((res) => res.json()).then((data) => {
            if (data === "dead") {
              this.setState({hp: {[monster_id]: 0}});
              document.getElementById("damage_fields").innerHTML = "Monster defeated!!"
            } else {
              this.setState({hp: {[monster_id]: data}});
            }
            this.setState({damage: {[monster_id]: ''}});
        })
    }

	render() {
		return (
			<div className="monster">
				<h2>Type: {this.props.type}</h2>
				<p>Total HP: {this.props.hp} <br />
                Current HP: {this.state.hp[this.props.monster_id]} <br />
                </p>
                <p>AC: {this.props.ac}<br />
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
                <p>
                    Speed: {this.props.speed} (Swim: {this.props.swim}, Fly: {this.props.fly}, Hover? {this.props.hover})<br />
                    Size: {this.props.size}
                </p>
                    <form onSubmit={this.dealDamage} id={this.props.monster_id}>
                    Combat damage: <br />
                    Damage dealt: <input type='number' onChange={this.damageHandling} id={this.props.monster_id} name='damage' value={this.state.damage[this.props.monster_id]}/><br />
                    Attacking player: <input type='text' name='player_attacking' onChange={this.damageHandling} id={this.props.monster_id} value={this.state.player_attacking[this.props.monster_id]}/><br />
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
            monsterCards: [],
            activated: false
		}
		this.makeMonsterCards = this.makeMonsterCards.bind(this);
        this.activated = this.activated.bind(this);
	}

    activated() {
        this.setState({activated: true});
        {this.props.firstMove()};
    }

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
                    activated={this.activated}
              	/>
            )
        );
	}

    render() {
        const monsterData = this.props.monsterList;
        const playerData = this.props.playerList;
        return (
            this.makeMonsterCards(monsterData, playerData)
        )
    }
}
