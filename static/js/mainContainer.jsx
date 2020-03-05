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
            diff: 0,
            num: 0,
            monsterList: [],
						player_name: '',
						player_init: 0,
						characterList: [],
						game_name: '',
						game_id: 0
		};
    this.login = this.login.bind(this);
    this.formHandling = this.formHandling.bind(this);
    this.initiateMonsters = this.initiateMonsters.bind(this);
    this.monsterSummoning = this.monsterSummoning.bind(this);
		this.addCharacter = this.addCharacter.bind(this);
		this.startCombat = this.startCombat.bind(this);
	}

    login() {
        this.setState({logged_in: !this.state.logged_in});
        console.log("set state: ", this.state.logged_in);
    }

    formHandling(evt) {
      this.setState({[evt.target.name]: evt.target.value});
    }

    initiateMonsters(evt) {
        evt.preventDefault();
        this.monsterSummoning();
    }

		addCharacter(evt) {
				evt.preventDefault();
				const playerName = this.state.player_name;
				const playerInit = this.state.player_init
				this.setState({characterList: [...this.state.characterList, {name: playerName, init: playerInit}] });
				console.log("added new player: ", playerName, playerInit);
				console.log("the status of character state: ", this.state.characterList);
				this.state.player_name = '';
				this.state.player_init = 0;
		}

		startCombat (evt) {
				const gameName = this.state.game_name;
				const gameUrl = '/new_game?gameName=' + gameName;
				let gameResponse = fetch(gameUrl);
				gameResponse.then((res) => res.json()).then((data) => {
					this.setState({game_id: data});
					const playerInfo = [this.state.game_id, this.state.characterList];
					const bodyPass = JSON.stringify(playerInfo);
					let charResponse = fetch('/new_character', {
						method: 'POST',
						headers: {'Content-Type': 'application/json'},
	          body: bodyPass
	        });
					charResponse.then((res) => res.json()).then((data) => {
						console.log("characters created? ", data);
					});
				});
		}

    monsterSummoning() {
      const monstRequest = {diff: this.state.diff, num: this.state.num};
      const bodyPass = JSON.stringify(monstRequest);
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
            if (this.state.game_id === 0) {
              return (
								<Router>
                  <div>
										<table>
											<tbody>
												<tr>
													<td>
			                    <b>Request Monsters!</b>
													</td>
													<td>
													<b>Add Players!</b>
													</td>
												</tr>
												<tr>
													<td>
				                    <form id="monster_request" onSubmit={this.initiateMonsters}>
				                    Number of Monsters: <input onChange={this.formHandling} type="number" id="monst_num" name="num" min="1" max="100" /><br />
				                    Difficulty Rating: <input onChange={this.formHandling} type="number" id="monst_diff" name="diff" min="0" max="30" /><br />
				                    <input type="submit" name="init_monsters" value="Call Monsters" /><br />
				                    </form>
													</td>
													<td>
														<form id="add_character" onSubmit={this.addCharacter}>
														Character Name: <input onChange={this.formHandling} type="text" id="player_name" name="player_name" value={this.state.player_name} /><br />
														Initiative Modifier: <input onChange={this.formHandling} type="number" id="player_init" name="player_init" min="0" max="30" value={this.state.player_init} /><br />
														<input type="submit" name="init_monsters" value="Add A Character" /><br />
														</form>
													</td>
													</tr>
											</tbody>
										</table>
										Game Name: <input type="text" name="game_name" value={this.state.game_name} onChange={this.formHandling} /><br />
										<Link to="/combatView"><button id="start_combat" onClick={this.startCombat}>Start Combat</button></Link>

										<Switch>
												<Route path="/combatView">
														<MonsterCardContainer monsterList={this.state.monsterList}/>
														<InitiativeContainer />
														<PlayerCardContainer playerList={this.state.characterList}/>
												</Route>
										</Switch>
                  </div>
								</Router>
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
