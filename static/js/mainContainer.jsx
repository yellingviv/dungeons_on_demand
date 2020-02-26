const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;
const Redirect = ReactRouterDOM.Redirect;

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

    Home() {
      return (
        <div className="homepage">
            home page placeholder
        </div>
      );
    }

    render() {
        if (this.state.logged_in === false) {
            return (
                <Router>
                    <div className="homepage">
                        <Link to="/login"><button name="login" type="button">Login</button></Link>
                        <Link to="/register"><button name="register" type="button">Register</button></Link>

                    <Switch>
                    <Route path="/login">
                        <LoginOrReg login={this.login} req="login" />
                    </Route>
                    <Route path="/register">
                        <LoginOrReg req="register" />
                    </Route>
                    </Switch>
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
            );
        }
    }
}

ReactDOM.render (<GameContainer />, document.getElementById('game'));
