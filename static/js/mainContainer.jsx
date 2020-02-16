// main game container -- most views will be subscripts
// this will hold the container carrying state for all other views
// this is also where login/logout and account creation is handled

class LoginOrReg extends React.Component {
    constructor(props) {
        console.log("this is right after instantiating LoginOrReg");
        super()
        this.state = {
            reg_message: ''
        }
        this.formTracking = this.formTracking.bind(this);
        this.handleRegClick = this.handleRegClick.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.offerLoginOrReg = this.offerLoginOrReg.bind(this);
    }

    formTracking(evt) {
    	let name = evt.target.name;
    	let value = evt.target.value;
        console.log("is THIS where we have state problems?");
    	this.setState({...this.state, [name]: value});
    	// extending or spreading
    	// let example = {firstname: 'hi', lastname: 'hello'};
    	// example = {...example, lastname: 'goodbye'};
    }

    handleRegClick() {
    	console.log('entered handleRegClick');
    	const regData = {username: this.state.new_username, password: this.state.new_password};
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
    		if (response.message === "failed") {
    			alert("That username is already claimed. Please login or try a different username.");
    		}
    	});
    	this.setState({response: response.message});
    }

    handleLoginClick() {
        const loginData = {username: this.state.username, password: this.state.password};
        console.log('login data is: ', loginData);
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
                console.log('hey it worked!');
    			// now we make the room space happen
    		} else {
    			alert("Error logging in. Please check your username and password and try again.");
    		}
    	});
    }

    offerLoginOrReg() {
		return (
            <div className="access_flow">
                <p>{this.state.reg_message}</p>
                <table id="access_flow">
                    <tbody>
                        <tr>
                            <td>
                                <h2>Login</h2>
                            </td>
                            <td>
                                <h2>Register</h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <form>
                                    Username: <input onChange={this.formTracking} type="text" name="username" /><br />
                                    Password: <input onChange={this.formTracking} type="password" name="password" /><br />
                                    <input onClick={this.handleLoginClick} type="submit" value="Login" name="call_login"/>
                                </form>
                            </td>
                            <td>
                                <form>
                                    Select username: <input onChange={this.formTracking} type="text" name="new_username" /><br />
                                    Create password: <input onChange={this.formTracking} type="password" name="new_password" /><br />
                                    <input onClick={this.handleRegClick} type="submit" value="Register" name="call_reg" />
                                </form>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
        console.log("here is the GameContainer constructor");
		super(props);
		this.state = {
            logged_in: '',
            room_view: '',
            player_view: '',
            initiative_view: '',
		};
	}

    render() {
        if (this.state.logged_in === '') {
            console.log("now we call loginorreg from the game container");
            return (<LoginOrReg />);
        } else if (this.state.logged_in != '') {
            console.log("this should not be happening");
          // serve the option to create a new room (or in future versions, games and new rooms)
          // once the new room is called, that should change the view state of the room to the room id
        } else if (this.state.room_view === 'live') {
            return (<MonsterCardContainer />);
        } else if (this.state.player_view === 'live') {
            console.log("this should not show yet");
          // show the player list -- in the future this will toggle off initiative and show stats
        }
    }
}

ReactDOM.render (<GameContainer />, document.getElementById('game'));
