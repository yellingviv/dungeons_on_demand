class GameStats extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            reg_message: '',
            username: '',
            password: ''
        }
        this.gameStats = this.gameStats.bind(this);
    }

    gameStats() {
      return (
        <div>
            This is a placeholder.
        </div>
      )
    }

    render() {
        return (
            <div className="access_flow">
                {this.gameStats()}
            </div>
        );
    }
}
