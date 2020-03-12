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
      this.setState({flow: flow});
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
          {this.props.login()};
          console.log('called login');
        }
        else if (flow === "Register") {
          this.setState({flow: "pass_thru"});
        }
      });
    }

    offerLoginOrReg() {
      // {this.regStatus()}
      if (this.props.req === "Login") {
      		return (
                <div id="holder_div">
                    <div className="row">
                        <div className="col creds">
                            <h2>{this.props.req}</h2>
                        </div>
                    </div>
                    <div className="row access_flow" id="access_flow">
                        <div class="col-6 creds">
                            Username:<br />
                            Password:<br />
                        </div>
                        <div class="col-6">
                            <form onSubmit={this.handleClick} name={this.props.req}>
                                <input onChange={this.formTracking} type="text" name="username" value={this.state.username}/><br />
                                <input onChange={this.formTracking} type="password" name="password" value={this.state.password}/><br />
                                <br />
                                <input type="submit" class="btn btn-primary btn-custom" value={this.props.req} name="call_access" />
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.flow === "pass_thru") {
            return (
              <div className="access_flow_passthru" id="access_flow_passthru">
                  <h2>You have successfully registered! Please login.</h2>
              </div>
            );
        } else if (this.props.req === "Register") {
            return (
                <div id="holder_div">
                    <div className="row">
                        <div className="col creds">
                            <h2>{this.props.req}</h2>
                        </div>
                    </div>
                    <div className="row access_flow" id="access_flow">
                        <div class="col-6 creds">
                            Username:<br />
                            Password:<br />
                        </div>
                        <div class="col-6">
                            <form onSubmit={this.handleClick} name={this.props.req}>
                                <input onChange={this.formTracking} type="text" name="username" value={this.state.username}/><br />
                                <input onChange={this.formTracking} type="password" name="password" value={this.state.password}/><br />
                                <br />
                                <input type="submit" class="btn btn-primary btn-custom" value={this.props.req} name="call_access" />
                            </form>
                        </div>
                    </div>
                </div>
            );}
    }

    render() {
        return (
            <div className="account_flow">
                {this.offerLoginOrReg()}
            </div>
        );
    }
}
