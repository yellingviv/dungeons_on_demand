class PlayerCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            room_id: 10,
            initiative: {},
            damage: {},
            hit_roll: {},
            attack: {},
            crit: {},
    }
    this.rollToHit = this.rollToHit.bind(this);
    this.rollInit = this.rollInit.bind(this);
  }

    rollToHit(evt) {
      const player_id = evt.target.id;
      const min = Math.ceil(1);
      const max = Math.floor(21);
      const roll = Math.floor(Math.random() * (max - min)) + min;
      this.setState({hit_roll: {[player_id]: roll}});
    }

    rollInit(evt) {
      const player_id = evt.target.id;
      let response = fetch('/roll_initiative?playerId=' + player_id);
      response.then((res) => res.json()).then((data) => {
           console.log('we rolled some player initiative, yo: ', data);
           this.setState({initiative: {[player_id]: data}});
      });
      {this.props.activated()};
    }

	render() {
		return (
			<div className="player">
				<h2>Name: {this.props.name}</h2>
        <p>Initiative Mod: {this.props.initiative_mod}<br />
        Current Initiative: {this.state.initiative[this.props.player_id]} <br />
        <button name="roll_init" type="button" id={this.props.player_id} onClick={this.rollInit}>Roll Initiative</button></p>
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
	}

  activated() {
    this.setState({activated: true});
  }

	makePlayerCards(playerData) {
		let playerCards = [];
    return (
		playerData.map((currentPlayer) =>
          <PlayerCard
          		key={currentPlayer.player_id}
          		player_id={currentPlayer.player_id}
              initiative_mod={currentPlayer.init}
              name={currentPlayer.name}
          	/>
          )
      );
	}

    render() {
      const playerData = this.props.playerList;
      if (this.state.activated === true) {
        {this.props.firstMove()};
      }
      return (
        this.makePlayerCards(playerData)
      )
  }
}
