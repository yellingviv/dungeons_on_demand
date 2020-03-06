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
						init_data: [],
						game_id: 0
		}
		this.showInitiativeOrder = this.showInitiativeOrder.bind(this);
	}

	componentDidMount() {
		console.log("called the componentdidmount function")
		const game_id = this.props.game;
		let initiativeData = [];
		const initUrl = '/order_initiative?gameId=' + game_id;
		let initOrder = fetch(initUrl);
		initOrder.then((res) => res.json()).then((data) => {
			console.log("initiative data is: ", data);
			initiativeData = data;
			this.setState({init_data: initiativeData});
		});
	}

  showInitiativeOrder() {
			let initiative = [];
			console.log(this.state.init_data)
			this.state.init_data.forEach((item, index) => {
	          initiative.push(
	          	<InitiativeCard
	          		key={index}
	              who={item.id}
	              initiative={item.init}
								type={item.type}
	          	/>
	          );
	        })
		    this.setState({ initiative: initiative });
				console.log(this.state.initiative)
		}

    render() {
				console.log("called the render initiative function")
				const game_id = this.props.game;
				console.log("received game id from main container game id: ", this.props.game);
        return (
          this.showInitiativeOrder()
        );
			}
  }
