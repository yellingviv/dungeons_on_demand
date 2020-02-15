// main game container -- most views will be subscripts
// this will hold the container carrying state for all other views
// this is also where login/logout and account creation is handled

class LoginOrReg extends React.Component {
    constructor(props) {
        super(props);
        this.formTracking = this.formTracking.bind(this);
        this.handleRegClick = this.handleRegClick.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.offerLoginOrReg = this.offerLoginOrReg.bind(this);
    }

    formTracking(evt) {
    	let name = evt.target.name;
    	let value = evt.target.value;
    	this.setState({...this.state, [name]: value});
    	// extending or spreading
    	// let example = {firstname: 'hi', lastname: 'hello'};
    	// example = {...example, lastname: 'goodbye'};
    }

    handleRegClick() {
    	console.log('entered handleRegClick');
    	const regData = {username: this.state.new_username, password: this.state.new_password}
    	console.log('reg data is: ', regData);
    	let response = fetch('/register', {
    		method: 'POST',
    		headers: {
        'Content-Type': 'application/json'
      	},
      	body: JSON.stringify(regData)
    	});
    	response.then((res) => res.json()).then((data) => {
    		console.log(data);
    		if (data != "failed") {
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
    		if (data != "failed") {
    			// now we make the room space happen
    		} else {
    			alert("Error logging in. Please check your username and password and try again.");
    		}
    	});
    }

    offerLoginOrReg() {
    	console.log(this.state)
		return (
            <div class="access_flow">
    			<div class="user_access" id="login">
    				<h2>Login</h2>
    				<form>
    					Username: <input onChange={this.formTracking} type="text" name="username" /><br />
    					Password: <input onChange={this.formTracking} type="password" name="password" /><br />
    					<input onCLick={this.handleLoginClick} type="submit" value="Login" name="call_login"/>
    				</form>
    			</div>
    			<div class="user_access" id="register">
    				<h2>Register</h2>
    				<form>
    					Select username: <input onChange={this.formTracking} type="text" name="new_username" /><br />
    					Create password: <input onChange={this.formTracking} type="password" name="new_password" /><br />
    					<input onClick={this.handleRegClick} type="submit" value="Register" name="call_reg" />
    				</form>
    			</div>
            </div>
		);
    }

    render() {
        return(
            <div>
                {this.offerLoginOrReg()}
            </div>
        );
    }
}

class GameContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            logged_in: '',
            room_view: '',
            player_view: '',
            initiative_view: ''
		};
	}

	componentDidMount() {
        if (this.state.logged_in === '') {
    		ReactDOM.render (<LoginOrReg />, document.getElementById('login_container'));
        } else {
            console.log("this should not be happening");
          // serve the option to create a new room (or in future versions, games and new rooms)
          // once the new room is called, that should change the view state of the room to the room id
        }
        if (this.state.room_view === 'live') {
            console.log("do not know why this is showing");
          // show the view of the room/monster list
          // this should also toggle on the initiative view
        }
        if (this.state.player_view === 'live') {
            console.log("this should not show yet");
          // show the player list -- in the future this will toggle off initiative and show stats
        }
	}

    render() {
        return(
            <p></p>
        );
    }
}

ReactDOM.render (<GameContainer />, document.getElementById('game'));
