import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

const Message = React.createClass({
	propTypes: {
		localUser: PropTypes.string.isRequired,
		user: PropTypes.string.isRequired,
		message: PropTypes.string.isRequired,
		time: PropTypes.string.isRequired

	},
	
	floatLeftOrRight () {
		if (this.props.localUser === this.props.user) {
			return "floatMessageRight"
		} else {
			return "floatMessageLeft"
		}
	},

	render () {
		return (
			<div className="messageContainer">
				<div className={this.floatLeftOrRight()}>
					<div className="timeStamp">{this.props.time}</div>
					<div className="messageText">{this.props.message}</div>
				</div>
			</div>
		)
	}
})

export default Message