const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;
const NavLink = ReactRouterDOM.NavLink;
const Redirect = ReactRouterDOM.Redirect;

class GameContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            logged_in: false,
            diff: '',
            num: '',
            monsterList: [],
			player_name: '',
			player_init: '',
			characterList: [],
			game_name: '',
			game_id: 0,
			first_move: false,
			req: '',
			init: false,
            initiative: [],
		};
    this.login = this.login.bind(this);
    this.formHandling = this.formHandling.bind(this);
    this.initiateMonsters = this.initiateMonsters.bind(this);
    this.monsterSummoning = this.monsterSummoning.bind(this);
	this.addCharacter = this.addCharacter.bind(this);
	this.startCombat = this.startCombat.bind(this);
	this.firstMove = this.firstMove.bind(this);
	this.handleReq = this.handleReq.bind(this);
	this.rollMonsterInit = this.rollMonsterInit.bind(this);
	this.rollPlayerInit = this.rollPlayerInit.bind(this);
    this.rollInit = this.rollInit.bind(this);
	}

    login() {
        this.setState({logged_in: !this.state.logged_in});
        console.log("set state: ", this.state.logged_in);
    }

	handleReq(evt) {
		this.setState({req: evt.target.name});
		console.log("set req to: ", this.state.req);
	}

    formHandling(evt) {
      this.setState({[evt.target.name]: evt.target.value});
    }

    initiateMonsters(evt) {
        evt.preventDefault();
        this.monsterSummoning();
    }

	firstMove() {
		this.setState({first_move: true});
		console.log("activated first move protocol: ", this.state.first_move);
	}

	addCharacter(evt) {
		evt.preventDefault();
		const playerName = this.state.player_name;
		const playerInit = this.state.player_init;
		this.setState({characterList: [...this.state.characterList, {name: playerName, init: playerInit}] });
		console.log("added new player: ", playerName, playerInit);
		console.log("the status of character state: ", this.state.characterList);
        this.setState({added: "New character " + this.state.player_name + " added to the game!"});
        this.state.player_name = '';
        this.state.player_init = '';
	}

	startCombat(evt) {
        evt.preventDefault();
		console.log("called startCombat");
		const gameName = this.state.game_name;
		const gameUrl = '/new_game?gameName=' + gameName;
		let gameResponse = fetch(gameUrl);
		gameResponse.then((res) => res.json()).then((data) => {
			this.setState({game_id: data});
			console.log("set game_id: ", data);
			const playerInfo = [this.state.game_id, this.state.characterList];
			const bodyPass = JSON.stringify(playerInfo);
			let charResponse = fetch('/new_character', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
                body: bodyPass
            });
			console.log("called the new character endpoint with: ", bodyPass);
			charResponse.then((res) => res.json()).then((data) => {
				this.setState({characterList: data});
				console.log("assigned to characterList: ", this.state.characterList);
			});
			const monstUrl = '/monster_update?gameId=' + this.state.game_id;
			let monstResponse = fetch(monstUrl);
			monstResponse.then((res) => res.json()).then((data) => {
				console.log("did we successfully update the monsters? ", data);
			});
		});
	}

	rollMonsterInit(game_id, resolve) {
	    const monstUrl = '/view_monster?gameId=' + game_id;
	    let monster_info = fetch(monstUrl);
	    monster_info.then((res) => res.json()).then((data) => {
            console.log("received this from monster api: ", data)
            let initLoop = new Promise((resolve, reject) => {
                console.log("inside monster promise");
                for (let monster of data) {
                    const monster_id = monster;
                    const init_url = '/roll_initiative?monsterId=' + monster_id;
                    let response = fetch(init_url);
                    response.then((res) => res.json()).then((data) => {
                        console.log('we rolled some monster initiative, yo: ', data);
                        this.setState({initiative: {[monster_id]: data}});
                    });
                }
                console.log("resolving inner promise");
                resolve("move on");
            })
            initLoop.then(() => {
                console.log("resolving monster promise");
                resolve("monster init rolled");
            })
        })
	}

	rollPlayerInit(game_id, resolve) {
        const playUrl = '/view_player?gameId=' + game_id;
        let player_info = fetch(playUrl);
            player_info.then((res) => res.json()).then((data) => {
            console.log("received from player api: ", data)
            for (let player of data) {
                const player_id = player;
                const init_url = '/roll_initiative?playerId=' + player_id;
                let response = fetch(init_url);
                response.then((res) => res.json()).then((data) => {
                    console.log('we rolled some player initiative, yo: ', data);
                    this.setState({initiative: {[player_id]: data}});
                })
            }
        });
	}

	rollInit(evt) {
		console.log("clicked roll initiative");
		const game_id = evt.target.name;
        let monsterInit = new Promise((resolve, reject) => {this.rollMonsterInit(game_id, resolve)})
        console.log("monsterInit: ", monsterInit);
        let playerInit = new Promise((resolve, reject) => {this.rollPlayerInit(game_id, resolve)})
        console.log("playerInit: ", playerInit);
		monsterInit.then(() => {
            console.log("finished monsterInit");
            playerInit}).then(() => {
                console.log("monsters: ", monsterInit);
                console.log("players: ", playerInit);
				console.log("initiative has been rolled: ", this.state.initiative);
				this.setState({init: true});
		})
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
            this.setState({added: "Your " + this.state.num + " monsters have been added to the game!"});
            console.log("about to change state: ", this.state.diff, this.state.num)
            this.state.diff = '';
            this.state.num = '';
            console.log("state changed: ", this.state.diff, this.state.num)
        });
    }

    render() {
        while (this.state.logged_in === false) {
            return (
                <Router>
                <div className="row">
                    <div className="img col-md-6">
                        <center>
                        <img src="/static/img/dungeon_img.jpg" className="img-fluid align-middle" id="dungeon_img"/>
                        <p id="img_license">
                            Photo by <a href="https://www.flickr.com/photos/meckert75/4940361043/" target="_blank">Martin Eckert on Flickr</a>, used under a Creative Commons License
                        </p>
                        </center>
                    </div>
                    <div className="homepage col-md-6 align-self-center">
                            <center>
                            <Link to="/login">
                            <button className="btn btn-primary btn-custom" name="Login" type="button" onClick={this.handleReq}>Login</button></Link> <Link to="/register">
                            <button className="btn btn-primary btn-custom" data-toggle="button" aria-pressed="false" name="Register" type="button" onClick={this.handleReq}>Register</button></Link>
                            </center>

                        <Switch>
                            <Route path="/login">
                                <LoginOrReg login={this.login} req={this.state.req} />
                            </Route>
                            <Route path="/register">
                                <LoginOrReg req={this.state.req} />
                            </Route>
                        </Switch>
                    </div>
                </div>
                </Router>
            );
        }
        while (this.state.logged_in === true) {
            if (this.state.game_id === 0) {
                return (
                    <div id="add_monsters_chars">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h2>Request Monsters!</h2>
                                    </td>
                                    <td>
                                        <h2>Add Players!</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-md-3">
                                        <form id="monster_request" onSubmit={this.initiateMonsters}>
                                        Number of Monsters: <input onChange={this.formHandling} type="number" id="monst_num" name="num" min="1" max="100" value={this.state.num} /><br />
                                        Difficulty Rating: <input onChange={this.formHandling} type="number" id="monst_diff" name="diff" min="0" max="30" value={this.state.diff} /><br />
                                        <input type="submit" className="btn btn-primary btn-custom" name="init_monsters" value="Call Monsters" /><br />
                                        </form>
                                    </td>
                                    <td className="col-md-3">
                                        <form id="add_character" onSubmit={this.addCharacter}>
                                        Character Name: <input onChange={this.formHandling} type="text" id="player_name" name="player_name" value={this.state.player_name} /><br />
                                        Initiative Modifier: <input onChange={this.formHandling} type="number" id="player_init" name="player_init" min="0" max="30" value={this.state.player_init} /><br />
                                        <input type="submit" className="btn btn-primary btn-custom" name="init_characters" value="Add A Character" /><br />
                                        </form>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <center>
                            <p id="request_status">
                                    {this.state.added}
                            </p>
                        </center>
                        <div className="row justify-content-center">
                            <form id="start_combat" onSubmit={this.startCombat}>
                                Game Name: <input type="text" name="game_name" value={this.state.game_name} onChange={this.formHandling} /><br />
                                <input type="submit" className="btn btn-primary btn-custom" value="Start Combat" />
                            </form>
                        </div>
                    </div>
                );
            } else {
                return (
                    <Router>
                        <div id="navContainer row">
                            <nav className="navbar navbar-expand-lg navbar_style">
                                <span className="navbar-brand">Dungeons on Demand</span>
                            <div className="navbar-nav">
                                <NavLink to="/combatView" className="nav-item nav-link" activeClassName="viewing">Combat View</NavLink><br />
                                <NavLink to="/viewMonsters" className="nav-item nav-link" activeClassName="viewing">View Monsters</NavLink><br />
                                <NavLink to="/viewPlayers" className="nav-item nav-link" activeClassName="viewing">View Players</NavLink><br />
                                <NavLink to="/viewInitiative" className="nav-item nav-link" activeClassName="viewing">View Initiative</NavLink><br />
                                <NavLink to="/gameStats" className="nav-item nav-link disabled" aria-disabled="true">Game Stats</NavLink>
                                <button className="btn btn-primary btn-custom" id="roll_init" name={this.state.game_id} onClick={this.rollInit}>Roll Initiative</button>
                            </div>
                            </nav>
                        </div>
                        <div className="row">
                            <Switch>
                                <Route path="/viewMonsters">
                                    <MonsterCardContainer monsterList={this.state.monsterList} />
                                </Route>
                                <Route path="/viewInitiative">
                                    <InitiativeCardContainer game={this.state.game_id} init={this.state.init} />
                                </Route>
                                    <Route path="/gameStats">
                                <GameStats />
                                </Route>
                                <Route path="/viewPlayers">
                                    <PlayerCardContainer playerList={this.state.characterList} />
                                </Route>
                                <Route path="/combatView">
                                    <MonsterCardContainer monsterList={this.state.monsterList} />
                                    <PlayerCardContainer playerList={this.state.characterList} />
                                    <InitiativeCardContainer game={this.state.game_id} init={this.state.init}/>
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
