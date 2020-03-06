class PlayerCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            room_id: 10,
            damage: {},
            hit_roll: {},
            attack: {},
            crit: {},
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
            playerCards: [],
            activated: false
		}
		this.makePlayerCards = this.makePlayerCards.bind(this);
    this.activated = this.activated.bind(this);
    this.rollInit = this.rollInit.bind(this);
	}

  activated() {
    this.setState({activated: true});
  }

  rollInit(player_id) {
    // const player_id = evt.target.id;
    console.log("this is the ID I received: ", player_id);
    let response = fetch('/roll_initiative?playerId=' + player_id);
    response.then((res) => res.json()).then((data) => {
         console.log('we rolled some player initiative, yo: ', data);
         return (data);
    });
  }

	makePlayerCards(playerData) {
		let playerCards = [];
    console.log("THERE ARE %i players", playerData.length);
      for (const currentPlayer of playerData) {
          console.log("this is what I am passing in: ", currentPlayer.player_id);
          this.rollInit(currentPlayer.player_id).then((res) =>
          playerCards.push(
              <PlayerCard
              		key={currentPlayer.player_id}
              		player_id={currentPlayer.player_id}
                  initiative_mod={currentPlayer.init}
                  initiative={res}
                  name={currentPlayer.name}
                  activated={this.activated}
              	/>
          ))}
      return (this.state.playerCards);
	}

    render() {
      const playerData = this.props.playerList;
      console.log("rendering playerData in PlayerCards: ", playerData);
      return (
        this.makePlayerCards(playerData)
      )
  }
}
