class LoginOrReg extends React.Component <Props> {
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
      const flow = evt.target.name === "login"?"login":"register";
      const userData = {username: this.state.username, password: this.state.password};
      const body_pass = JSON.stringify(userData);
      let response = fetch('/'+flow, {
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
      this.setState({reg_message: data['message']});
      if (flow === "login") { this.props.login }
        });
    }

    offerLoginOrReg() {
        if (this.props.req === "login") {
    		return (
                <div className="access_flow">
                    <p>{this.state.reg_message}</p>
                    <h2>Login</h2>
                    <form onSubmit={this.handleClick} name="login">
                        Username: <input onChange={this.formTracking} type="text" name="username" /><br />
                        Password: <input onChange={this.formTracking} type="password" name="password" /><br />
                        <input type="submit" value="Login" name="call_login" />
                    </form>
                </div>
            );
        } else {
            return (
                <div className="access_flow">
                    <p>{this.state.reg_message}</p>
                    <h2>Register</h2>
                    <form onSubmit={this.handleClick} name="registration">
                        Select username: <input onChange={this.formTracking} type="text" name="username" /><br />
                        Create password: <input onChange={this.formTracking} type="password" name="password" /><br />
                        <input type="submit" value="Register" name="call_reg" />
                    </form>
                </div>
            );
        }
    }

    render() {
        return (
            <div> {this.offerLoginOrReg} </div>
        );
    }
}
