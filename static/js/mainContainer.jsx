// main game container -- most views will be subscripts
// this will hold the container carrying state for all other views
// this is also where login/logout and account creation is handled

// okay frands we need to learn react router oh boy oh no oh goody

class GameContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            logged_in: false
		};
	}

    login() {
        this.setState({logged_in: !this.state.logged_in})
    }

    render() {
        if (this.state.logged_in === false) {
            return (
                <Router>
                    <div className="homepage">
                        <Link to="/login"><button name="login" type="button" /></Link>
                        <Link to="/register"><button name="register" type="button" /></Link>

                    <Switch>
                    <Route path="/login">
                        <LoginOrReg login={this.login} req="login" />
                    </Route>
                    <Route path="/register">
                        <LoginOrReg req="register" />
                    </Route>
                    </div>
                </Router>
            );
        } else {
            return (
                <Router>
                  <div>
                    <Link to="/">Logout</Link>
                    <Link to="/requestMonsters">Request Monsters</Link>
                    <Link to="/viewMonsters">View Monsters</Link>
                    <Link to="/viewInitiative">View Initiative</Link>
                    <Link to="/gameStats">View Game Stats</Link>
                    
                    <Switch>
                        <Route path="/requestMonsters">
                            <SummonMonsters />
                        </Route>
                        <Route path="/viewMonsters">
                            <MonsterCardContainer />
                        </Route>
                        <Route path="/viewInitiative">
                            <InitiativeContainer />
                        </Route>
                        <Route path="/gameStats">
                            <GameStats />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                  </div>
                </Router>
            )
        }
    }

    Home() {
      return (
        <div className="homepage">
            home page placeholder
        </div>
      );
    }

    About() {
      return (<h2>About</h2>)
    }
}

ReactDOM.render (<GameContainer />, document.getElementById('game'));
