// main game container -- most views will be subscripts
// this will hold the container carrying state for all other views
// this is also where login/logout and account creation is handled

class LoginOrReg extends React.Component {

}

class GameContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            logged_in: '',
            room_view: '',
            player_view: '',
            initiative_view: ''
		}
		this.logged_in = this.logged_in.bind(this);
    this.room_view = this.room_view.bind(this);
    this.player_view = this.player_view.bind(this);
    this.initiative_view = this.initiative_view.bind(this);
		this.handleRegClick = this.handleRegClick.bind(this)
	}

	componentDidMount() {
    if this.state.logged_in === '' {
			offerLoginOrReg();
    } else {
      // serve the option to create a new room (or in future versions, games and new rooms)
      // once the new room is called, that should change the view state of the room to the room id
    }
    if this.state.room_view === 'live' {
      // show the view of the room/monster list
      // this should also toggle on the initiative view
    }
    if this.state.player_view === 'live' {
      // show the player list -- in the future this will toggle off initiative and show stats
    }
	}
}

formTracking(evt) {
	let name = evt.target.name;
	let value = nevt.target.value;
	this.setState({name: value});
}

handleRegClick() {
	const regData = {username: this.state.new_username, password: this.state.new_password}
	let response = fetch('/register', {
		method: 'POST',
		headers: {
    'Content-Type': 'application/json'
  	},
  	body: JSON.stringify(regData)
	});
	response.then((res) => res.json()).then((data) => {
		console.log(data);
		if data != "failed" {
			alert("Your account has been created. Please login.");
		} else {
			alert("That username is already claimed. Please login or try a different username.");
		}
	});
	this.setState({stuff_from_server: 'yep', logged_in: response.user_id, message: response.message})
}

handleLoginClick(loginData) {
	let response = fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(loginData)
	});
	response.then((res) => res.json()).then((data) => {
		console.log(data);
		if data != "failed" {
			// now we make the room space happen
		} else {
			alert("Error logging in. Please check your username and password and try again.");
		}
	});
}

offerLoginOrReg() {
	console.log(this.state)
	render() {
		return (
			<div class="user_access" id="login">
				<h2>Login</h2>
				<form>
					Username: <input onChange={this.formTracking} type="text", name="username" /><br />
					Password: <input type="password", name="password" /><br />
					<input onCLick={this.handleLoginClick} type="submit", value="Login", name="call_login"/>
				</form>
			</div>
			<div class="user_access" id="register">
				<h2>Register</h2>
				<form>
					Select username: <input type="text" name="new_username" /><br />
					Create password: <input type="password" name="new_password" /><br />
					<input onClick={this.handleRegClick} type="submit", value="Register", name="call_reg" />
				</form>
			</div>
		);
	}
}

// this should only be called once the user is logged in -- how to assure this?
// should this actually go inside yet a larger container, that calls this once logged in state is set?
ReactDOM.render (<GameContainer />, document.getElementById('game_container'));
