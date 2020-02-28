class SummonMonsters extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            reg_message: '',
            username: '',
            password: ''
        }
        this.formTracking = this.formTracking.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.summonMonsters = this.summonMonsters.bind(this);
    }

    formTracking(evt) {
      this.setState({[evt.target.name]: evt.target.value});
    }

    handleClick(evt) {
      evt.preventDefault();
      const flow = evt.target.name === "login"?"login":"register";
      const userData = {username: this.state.username, password: this.state.password};
      const body_pass = JSON.stringify(userData);
      this.state.password = '';
      this.state.username = '';
      let response = fetch('/'+flow, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
            body: body_pass
      });
        response.then((res) => res.json()).then((data) => {
        if (data['status'] === "failed") {
          console.log(data['message']);
        }
            this.setState({reg_message: data['message']});
            if (flow === "login") {
              {this.props.login()};
              console.log('called login');
            }
        });
    }

    summonMonsters() {
      return (
        <div>
            This is a placeholder.
        </div>
      )
    }

    render() {
        return (
            <div className="access_flow">
                {this.summonMonsters()}
            </div>
        );
    }
}
