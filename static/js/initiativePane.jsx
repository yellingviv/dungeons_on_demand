class InitiativeContainer extends React.Component {
	render() {
		return (
			<div className="initiative" id={this.props.initiative_order}>
      </div>
		);
	}
}

class InitiativeTab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            initiative: []
		}
		this.makeInitiativeOrder = this.makeInitiativeOrder.bind(this);
	}

// call to back end to calculate order of monsters and players with initiative rolls
// initially will just be monsters until i can instantiate players too, focus on monst first

	componentDidMount() {
		let response = fetch('/initiative_order');
        console.log("calling the initiative calculator");
		response.then((res) => res.json()).then((data) => {
			this.makeInitiativeOrder(data)
        })
	}

  makeInitiativeOrder(intiativeData) {
		let initiative = [];
		for (const currentPlayer of initiativeData) {
          initiative.push(
          	<InitiativeTab
          		key={currentPlayer.initiative_order}
              who={currentPlayer.identifier}
              initiative={currentPlayer.initiative_roll}
          	/>
          );
        }
	    this.setState({ initiative: initiative });
	}

    render() {
		if (this.state.initiative.length === 0) {
			return (
				<div> Calculating ... </div>
			);
		}
        return (
          <div>
            {this.state.initiative}
          </div>
        );
  }
}
