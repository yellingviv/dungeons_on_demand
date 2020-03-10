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
			game_id: 0,
			first_move: false,
			req: '',
			init: false,
            initiative: []
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
		this.state.player_name = '';
		this.state.player_init = 0;
	}

	startCombat(evt) {
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
        });
    }

    render() {
        while (this.state.logged_in === false) {
            return (
                <Router>
                    <div className="homepage">
                        <Link to="/login"><button name="Login" type="button" onClick={this.handleReq}>Login</button></Link>
                        <Link to="/register"><button name="Register" type="button" onClick={this.handleReq}>Register</button></Link>

                        <Switch>
                            <Route path="/login">
                                <LoginOrReg login={this.login} req={this.state.req} />
                            </Route>
                            <Route path="/register">
                                <LoginOrReg req={this.state.req} />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            );
        }
        while (this.state.logged_in === true) {
            if (this.state.game_id === 0) {
                return (
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
                        <button id="start_combat" onClick={this.startCombat}>Start Combat</button>
                    </div>
                );
            } else {
                return (
                    <Router>
                        <div>
                            <Link to="/combatView">Combat View</Link> - <Link to="/gameStats">Game Stats</Link><br />
                            <Link to="/viewMonsters">View Monsters</Link> - <Link to="/viewPlayers">View Players</Link> - <Link to="/viewInitiative">View Initiative</Link><br />
                            <button id="roll_init" name={this.state.game_id} onClick={this.rollInit}>Roll Initiative</button>
                            <Switch>
                                <Route path="/viewMonsters">
                                    <MonsterCardContainer monsterList={this.state.monsterList playerList={this.state.characterList} />
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
                                    <MonsterCardContainer monsterList={this.state.monsterList} playerList={this.state.characterList} />
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
