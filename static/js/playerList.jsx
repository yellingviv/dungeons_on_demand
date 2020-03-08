class PlayerCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            room_id: 10,
            damage: {},
            hit_roll: {},
            attack: {},
            crit: {},
            initiative: 0
    }
    this.rollToHit = this.rollToHit.bind(this);
  }

    rollToHit(evt) {
      const player_id = evt.target.id;
      const min = Math.ceil(1);
      const max = Math.floor(21);
      const roll = Math.floor(Math.random() * (max - min)) + min;
      this.setState({hit_roll: {[player_id]: roll}});
    }

	render() {
		return (
			<div className="player">
				<h2>Name: {this.props.name}</h2>
        <p>Initiative Mod: {this.props.initiative_mod}<br />
        Current Initiative: {this.props.initiative} <br />
        </p>
        <button id={this.props.player_id} onClick={this.rollToHit}>Roll To Hit</button> {this.state.hit_roll[this.props.player_id]} <br />
			</div>
		);
	}
}

class PlayerCardContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            activated: false,
            initiative: 0
		}
		this.makePlayerCards = this.makePlayerCards.bind(this);
	}

	makePlayerCards(playerData) {
		let playerCards = [];
        console.log("THERE ARE %i players", playerData.length);
        return (
    		playerData.map((currentPlayer) =>
              <PlayerCard
              		key={currentPlayer.player_id}
              		player_id={currentPlayer.player_id}
                  initiative_mod={currentPlayer.init}
                  initiative={this.state.initiative[currentPlayer.player_id]}
                  name={currentPlayer.name}
                  activated={this.activated}
              	/>
          ))
	}

    render() {
      const playerData = this.props.playerList;
      console.log("passed into playerCard render: ", playerData);
      console.log("calling the card making function")
        return (
          this.makePlayerCards(playerData)
        );
      }
}
