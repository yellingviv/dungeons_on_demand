const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;
const Redirect = ReactRouterDOM.Redirect;

class GameContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            logged_in: false,
            game_is_live: false,
            diff: 0,
            num: 0,
            monsterList: []
		};
    this.login = this.login.bind(this);
    this.formHandling = this.formHandling.bind(this);
    this.gameLive = this.gameLive.bind(this);
    this.initiateMonsters = this.initiateMonsters.bind(this);
    this.monsterSummoning = this.monsterSummoning.bind(this);
	}

    login() {
        this.setState({logged_in: !this.state.logged_in});
        console.log("set state: ", this.state.logged_in);
    }

    gameLive() {
      this.setState({game_is_live: true});
      console.log("activated game");
    }

    formHandling(evt) {
      this.setState({[evt.target.name]: evt.target.value});
    }

    initiateMonsters(evt) {
        evt.preventDefault();
        this.gameLive();
        this.monsterSummoning();
    }

    monsterSummoning() {
      const monstRequest = {diff: this.state.diff, num: this.state.num};
      const bodyPass = JSON.stringify(monstRequest);
      console.log("calling the monster api with info: ", monstRequest);
      let response = fetch('/show_monsters', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
              body: bodyPass
          });
      console.log("api call happening")
      response.then((res) => res.json()).then((data) => {
        this.setState({monsterList: data});
        console.log("assigned to monsterList: ", this.state.monsterList);
      });
      return (
        <MonsterCardContainer monsterList={this.state.monsterList} />
      );
    }

    render() {
        while (this.state.logged_in === false) {
            return (
                <Router>
                    <div className="homepage">
                        <Link to="/login"><button name="login" type="button">Login</button></Link>
                        <Link to="/register"><button name="register" type="button">Register</button></Link>

                    <Switch>
                    <Route path="/login">
                        <LoginOrReg login={this.login} req="Login" />
                    </Route>
                    <Route path="/register">
                        <LoginOrReg req="Register" />
                    </Route>
                    </Switch>
                    </div>
                </Router>
            );
        }
        while (this.state.logged_in === true) {
            if (this.state.game_is_live === false) {
              return (
                    <div>
                    Request Monsters!<br />
                    <br />
                    <form id="monster_request" onSubmit={this.initiateMonsters}>
                    Number of Monsters: <input onChange={this.formHandling} type="number" id="monst_num" name="num" min="1" max="100" /><br />
                    Difficulty Rating: <input onChange={this.formHandling} type="number" id="monst_diff" name="diff" min="0" max="30" /><br />
                    <input type="submit" name="init_monsters" value="Call Monsters" /><br />
                    </form>
                  </div>
              );
            } else {
              return (
                  <Router>
                    <div>
                      <Link to="/viewMonsters">View Monsters</Link><br />
                      <Link to="/viewInitiative">View Initiative</Link><br />
                      <Link to="/gameStats">View Game Stats</Link>

                      <Switch>
                          <Route path="/viewMonsters">
                              <MonsterCardContainer monsterList={this.state.monsterList}/>
                          </Route>
                          <Route path="/viewInitiative">
                              <InitiativeContainer />
                          </Route>
                          <Route path="/gameStats">
                              <GameStats />
                          </Route>
                      </Switch>
                    </div>
                  </Router>
              );
            }
        }
    }
}

ReactDOM.render (<GameContainer />, document.getElementById('game'));
