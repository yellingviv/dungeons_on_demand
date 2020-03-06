class InitiativeCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
						initiative: [],
						game_id: 0
		}
	}

	render() {
		return (
			<div className="initiative" id={this.props.initiative_order}>
					this is a placeholder while I make sure I at last have this right sheesh
      </div>
		);
	}
}

class InitiativeCardContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            initiative: [],
						game_id: 0
		}
		this.showInitiativeOrder = this.showInitiativeOrder.bind(this);
	}

// call to back end to calculate order of monsters and players with initiative rolls
// initially will just be monsters until i can instantiate players too, focus on monst first

  showInitiativeOrder(game_id) {
		let initiative = [];
		let initiativeData = [];
		const initUrl = '/order_initiative?gameId=' + game_id;
		let initOrder = fetch(initUrl);
		initOrder.then((res) => res.json()).then((data) => {
			console.log("initiative data is: ", data);
			initiativeData = data;
			for (const character of initiativeData) {
	          initiative.push(
	          	<InitiativeCard
	          		key={currentPlayer.initiative_order}
	              who={currentPlayer.identifier}
	              initiative={currentPlayer.initiative_roll}
	          	/>
	          );
	        }
		    this.setState({ initiative: initiative });
		});
	}

    render() {
				const game_id = this.props.game;
				console.log("received from main container game id: ", this.props.game);
				console.log("passing into function: ", game_id);
        return (
          this.showInitiativeOrder(game_id)
        );
			}
  }
