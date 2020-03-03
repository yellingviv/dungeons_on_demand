class LoginOrReg extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            reg_message: '',
            username: '',
            password: '',
            flow: ''
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
      const flow = evt.target.name === "Login"?"Login":"Register";
      const userData = {username: this.state.username, password: this.state.password};
      const body_pass = JSON.stringify(userData);
      this.state.password = '';
      this.state.username = '';
      let response = fetch('/'+flow.toLowerCase(), {
    		method: 'POST',
    		headers: {'Content-Type': 'application/json'},
      	    body: body_pass
    	});
        response.then((res) => res.json()).then((data) => {
    		if (data['status'] === "failed") {
    			console.log(data['message']);
    		}
            this.setState({reg_message: data['message']});
            if (flow === "Login") {
              setState({flow: "Login"});
              {this.props.login()};
              console.log('called login');
            }
            return (
              <p>{this.state.reg_message}</p>
            )
        });
    }

    offerLoginOrReg() {
        setState({flow: this.props.req})
    		return (
                <div className="access_flow">
                    <h2>{this.state.flow}</h2>
                    <form onSubmit={this.handleClick} name={this.props.req}>
                        Username: <input onChange={this.formTracking} type="text" name="username" value={this.state.username}/><br />
                        Password: <input onChange={this.formTracking} type="password" name="password" value={this.state.password}/><br />
                        <input type="submit" value={this.props.req} name="call_access" />
                    </form>
                </div>
            );
    }

    render() {
        return (
            <div className="access_flow">
                {this.offerLoginOrReg()}
            </div>
        );
    }
}
