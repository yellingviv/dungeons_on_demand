class InitiativeCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			initiative: [],
			game_id: 0,
		}
	}

	render() {
        console.log("successfully called the InitiativeCard class");
		return (
			<div className="initiative" id=>
				Who: {this.props.who}<br />
                Initiative: {this.props.initiative}<br />
                Type: {this.props.type}<br />
                Order: {this.props.key}
            </div>
		);
	}
}

class InitiativeCardContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			game_id: 0,
			init_data: ''
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
        let init_list = [];
		console.log(this.state.init_data)
		this.state.init_data.forEach((item, index) => {
			init_list.push(
                <InitiativeCard
                    key={index}
                    order={index}
                    who={item.id}
                    initiative={item.init}
                    type={item.type}
                />)
            console.log("card is: ", index, item.id, item.init, item.type)
        })
        return (
            init_list
        )
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
