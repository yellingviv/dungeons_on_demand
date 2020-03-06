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
            activated: false
		}
		this.makePlayerCards = this.makePlayerCards.bind(this);
    this.activated = this.activated.bind(this);
    this.rollInit = this.rollInit.bind(this);
	}

  activated() {
    this.setState({activated: true});
  }

  rollInit(playerData) {
    // const player_id = evt.target.id;
    let initiative = [];
    for (const player of playerData) {
      const player_id = player['player_id'];
      console.log("in the for loop, my player_id is: ", player_id)
      let response = fetch('/roll_initiative?playerId=' + player_id);
      response.then((res) => res.json()).then((data) => {
           console.log('we rolled some player initiative, yo: ', data);
           initiative.push({[player_id]: data});
           console.log("pushed to initiative list: ", initiative);
      });
      this.setState({initiative: initiative});
    }
  }

	makePlayerCards() {
		let playerCards = [];
    console.log("THERE ARE %i players", playerData.length);
      for (const currentPlayer of playerData) {
          console.log("this is what I am passing in: ", currentPlayer.player_id);
          this.state.initiative[currentPlayer.player_id].then((res) =>
          playerCards.push(
              <PlayerCard
              		key={currentPlayer.player_id}
              		player_id={currentPlayer.player_id}
                  initiative_mod={currentPlayer.init}
                  initiative={this.state.initiative[currentPlayer.player_id]}
                  name={currentPlayer.name}
                  activated={this.activated}
              	/>
          ))}
      this.setState({playerCards: playerCards});
	}

    render() {
      const playerData = this.props.playerList;
      console.log("passed into playerCard render: ", playerData);
      if (!this.state.initiative) {
        console.log("no initiative found, calling init func");
        this.rollInit(playerData);
        return (<div>Loading...</div>);
      } else {
        console.log("initiative found, making cards");
        return (
          this.makePlayerCards(playerData)
        );
      }
    }
}
