class MonsterCard extends React.Component {
	render() {
		return (
			<div className="monster" id={this.props.monster_id}>
				<h2>Type: {this.props.type}</h2>
				<h2 id="hp">HP: {this.props.hp} </h2>
                <p>Initiative: {this.props.initiative}<br>
                AC: {this.props.ac}<br>
                Hit dice: {this.props.dice_num}d{this.props.dice_type} + {this.props.bonus}<br>
                <table>
                    <tr>
                        <td>STR: {this.props.str}</td><td>DEX: {this.props.dex}</td><td>CON: {this.props.con}</td>
                    </tr>
                    <tr>
                        <td>INT: {this.props.int}</td><td>WIS: {this.props.wis}</td><td>CHA: {this.props.cha}</td>
                    </tr>
                </table>
                Speed: {this.props.speed} (Swim: {this.props.swim}, Fly: {this.props.fly}, Hover? {this.props.hover})<br>
                Size: {this.props.size}
			</div>
		);
	}
}


const monsterCardData = [

    // need to pull this from the back end
  {
    monster_id,
    type,
    hp,
    initiative,
    ac,
    dice_num, dice_type, bonus
    str, dex, con,
    int, wis, cha,
    speed (swim, fly, hover),
    size
  },

];


class monsterCardContainer extends React.Component {
  render() {
    const monsterCards = [];

    for (const currentCard of MonsterCardData) {
      tradingCards.push(
      	<MonsterCard
      		key={currentCard.name}
      		name={currentCard.name}
      		skill={currentCard.skill}
      		imgUrl={currentCard.imgUrl}
      	/>
      	);
    }

    return (
      <div>
        {MonsterCards}
      </div>
    );
  }
}

ReactDOM.render (<MonsterListContainer />, document.getElementById('container'));
