// main game container -- most views will be subscripts
// this will hold the container carrying state for all other views
// this is also where login/logout and account creation is handled

// okay frands we need to learn react router oh boy oh no oh goody

class GameContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            logged_in: '',
            room_view: '',
            player_view: '',
            initiative_view: '',
		};
	}

    render() {
        if (!this.state.logged_in) {
            return (<LoginOrReg callback={this.setState} />);
        } else if (this.state.logged_in) {
            console.log("successfully changed the state of logged in");
            return (<div>"oh hi"</div>);
        }
          // serve the option to create a new room (or in future versions, games and new rooms)
          // once the new room is called, that should change the view state of the room to the room id
        if (this.state.room_view === 'live') {
            return (<MonsterCardContainer />);
        } else if (this.state.player_view === 'live') {
            console.log("this should not show yet");
          // show the player list -- in the future this will toggle off initiative and show stats
        }
    }
}

ReactDOM.render (<GameContainer />, document.getElementById('game'));
