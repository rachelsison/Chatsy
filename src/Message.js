import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

class Message extends React.Component {
	constructor(props) {
		super(props);
		
	}
	
	floatLeftOrRight () {
		if (this.props.localUser === this.props.user) {
			return "floatMessageRight"
		} else {
			return "floatMessageLeft"
		}
	}

	showUserName () {
		if (this.props.showName) {
			return this.props.user
		}
	}

	render () {
		return (
			<div className="messageContainer">
				<div className={this.floatLeftOrRight()}>
					<div className="messageUserName">{this.showUserName()}</div>
					<div title={this.props.time} className="messageText">{this.props.message}</div>
				</div>
			</div>
		)
	}
}

Message.propTypes = {
	localUser: PropTypes.string.isRequired,
	user: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	time: PropTypes.string.isRequired,
	showName: PropTypes.bool

};

export default Message