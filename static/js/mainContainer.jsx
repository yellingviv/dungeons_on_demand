// main game container -- most views will be subscripts
// this will hold the container carrying state for all other views
// this is also where login/logout and account creation is handled



// this should only be called once the user is logged in -- how to assure this?
// should this actually go inside yet a larger container, that calls this once logged in state is set?
ReactDOM.render (<GameContainer />, document.getElementById('game_container'));
