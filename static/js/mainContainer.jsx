// main game container -- most views will be subscripts
// this will hold the container carrying state for all other views
// this is also where login/logout and account creation is handled

class GameContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            logged_in: '';
            room_view: '';
            player_view: '';
            initiative_view: '';
		}
		this.logged_in = this.logged_in.bind(this);
    this.room_view = this.room_view.bind(this);
    this.player_view = this.player_view.bind(this);
    this.initiative_view = this.initiative_view.bind(this);
	}

	componentDidMount() {
    if this.state.logged_in === '' {
      // serve the log in or create account modal
    } else {
      // serve the option to create a new room (or in future versions, games and new rooms)
      // once the new room is called, that should change the view state of the room to the room id
    }
    if this.state.room_view === 'live' {
      // show the view of the room/monster list
      // this should also toggle on the initiative view
    }
    if this.state.player_view === 'live' {
      // show the player list -- in the future this will toggle off initiative and show stats
    }
	}


// this should only be called once the user is logged in -- how to assure this?
// should this actually go inside yet a larger container, that calls this once logged in state is set?
ReactDOM.render (<GameContainer />, document.getElementById('game_container'));
