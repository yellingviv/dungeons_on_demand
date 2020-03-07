class InitiativeCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
						initiative: [],
						game_id: 0,
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
						game_id: 0,
						initiative: []
		}
		this.showInitiativeOrder = this.showInitiativeOrder.bind(this);
		this.getInit = this.getInit.bind(this);

	}

	getInit() {
		console.log("called the getinit function")
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
			const init_list = this.state.init_data;
			init_list.forEach((item, index) => {
						console.log(item, index);
	          initiative.push(
	          	<InitiativeCard
	          		key={index}
	              who={item.id}
	              initiative={item.init}
								type={item.type}
	          	/>
	          );
	        })
				console.log(this.state.initiative)
		}

    render() {
			console.log("current situation with init from main: ", this.props.init, " and init_data ", this.state.init_data);
			if (!this.props.init) {
				return(
					<div>
						You haven't rolled initiative yet, so there's nothing to show. Please roll initiative and come back!
					</div>
				)
			} else if (!this.state.init_data) {
				console.log("summoning the initiative stuff");
				this.getInit();
				return (
					<div>
					<p>Loading...</p>
					</div>
				)
			} else if (this.state.init_data) {
				console.log("called the show init function");
        return (
          this.showInitiativeOrder()
        );
			}
  }
}
