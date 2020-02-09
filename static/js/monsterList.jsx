class MonsterCard extends React.Component {
	render() {
		return (
			<div className="monster" id={this.props.monster_id}>
				<h2>Type: {this.props.type}</h2>
				<h2 id="hp">HP: {this.props.hp} </h2>
                <p>Initiative: {this.props.initiative}<br />
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
                <p>Speed: {this.props.speed} Swim: {this.props.swim}, Fly: {this.props.fly}, Hover? {this.props.hover}<br />
                Size: {this.props.size}
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

	componentDidMount() {
		let response = fetch('/monster_test');
        console.log("calling the monster api");
		response.then((res) => res.json()).then((data) => {
			this.makeMonsterCards(data)
        })
	}

	makeMonsterCards(monsterData) {
        console.log('makemonstercards and data', monsterData)
		let monsterCards = [];
        console.log("starting the for loop");
		for (const currentMonst of monsterData) {
          monsterCards.push(
          	<MonsterCard
          		key={currentMonst.type}
          		monster_id={currentMonst.monster_id}
          	    type={currentMonst.type}
          		hp={currentMonst.hp}
                initiative={currentMonst.initiative}
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
          );
          console.log("new monster card created");
        }
        console.log("monster cards!", monsterCards);
	    this.setState({ monsterCards: monsterCards });
	}

    render() {
		if (this.state.monsterCards.length === 0) {
			return (
				<div> Loading ... </div>
			);
		}
        return (
          <div>
            {this.state.monsterCards}
          </div>
        );
  }
}

ReactDOM.render (<MonsterCardContainer />, document.getElementById('monster_container'));
