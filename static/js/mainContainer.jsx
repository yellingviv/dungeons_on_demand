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

handleRegClick() {
	let response = fetch('/register');
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

offerLoginOrReg() {
	console.log(this.state)
	render() {
		return (
			<div class="user_access" id="login">
				<h2>Login</h2>
				<form>
					Username: <input type="text", id="username" /><br />
					Password: <input type="password", id="password" /><br />
					<input type="submit", value="Login" id="call_login"/>
				</form>
			</div>
			<div class="user_access" id="register">
				<h2>Register</h2>
				<form>
					Select username: <input type="text" id="new_username" /><br />
					Create password: <input type="password" id="new_password" /><br />
					<input onClick={this.handleClick} type="submit", value="Register" id="call_reg" />
				</form>
			</div>
		);
	}
	const reg_button = document.getElementById("call_reg");
	const
	reg_button.addEventListener("click", register => {
		response = fetch('/register');
		response.then((res) => res.json()).then((data) => {
			if data != "failed" {
				alert("Your account has been created. Please login.");
			} else {
				alert("That username is already claimed. Please login or try a different username.");
			}
		});
	});
	const login_button = document.getElementById("call_login");
	login_button.addEventListener("click", login => {
		response = fetch('/login');
		response.then((res) => res.json()).then((data) => {
			if data != "failed" {
				serveRoomMenu(user_id);
			} else {
				alert("Error logging in. Please check your username and password and try again.");
			}
		});
	});
}

// this should only be called once the user is logged in -- how to assure this?
// should this actually go inside yet a larger container, that calls this once logged in state is set?
ReactDOM.render (<GameContainer />, document.getElementById('game_container'));
