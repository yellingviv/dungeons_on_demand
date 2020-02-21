class LoginOrReg extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            reg_message: '',
            username: undefined,
            password: undefined
        }
        this.formTracking = this.formTracking.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.offerLoginOrReg = this.offerLoginOrReg.bind(this);
    }

    formTracking(evt) {
    	this.setState({[evt.target.name]: evt.target.value});
    }

    handleClick(evt) {
      evt.preventDefault();
      if (evt.target.name === "call_login") {
        const flow = "login";
      } else if (evt.target.name === "call_reg") {
        const flow = "register";
      }
    	const userData = {username: this.state.username, password: this.state.password};
    	console.log('user data is: ', userData);
      const body_pass = JSON.stringify(userData);
      console.log('and the body is...', body_pass);
    	let response = fetch('/'flow, {
    		method: 'POST',
    		headers: {
        'Content-Type': 'application/json'
      	},
      	body: body_pass
    	});
    	response.then((res) => res.json()).then((data) => {
    		if (data['status'] === "failed") {
    			console.log(data['message']);
    		}
    	});
    	this.setState({response: data['message']});
      console.log(data['message']);
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
                                <form onSubmit={this.handleClick}>
                                    Username: <input onChange={this.formTracking} type="text" name="username" /><br />
                                    Password: <input onChange={this.formTracking} type="password" name="password" /><br />
                                    <input type="submit" value="Login" name="call_login"/>
                                </form>
                            </td>
                            <td>
                                <form onSubmit={this.handleClick}>
                                    Select username: <input onChange={this.formTracking} type="text" name="new_username" /><br />
                                    Create password: <input onChange={this.formTracking} type="password" name="new_password" /><br />
                                    <input type="submit" value="Register" name="call_reg" />
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
