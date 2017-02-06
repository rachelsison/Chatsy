import React from 'react';
import UserScreen from './UserScreen';
import _ from 'lodash';
import './App.css';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBE88kR1qk1BcZ42m5qpxwEASbJbQ-Unrk",
  authDomain: "chatty-40852.firebaseapp.com",
  databaseURL: "https://chatty-40852.firebaseio.com",
  storageBucket: "chatty-40852.appspot.com",
  messagingSenderId: "1059490176611"
};
firebase.initializeApp(config);

const App = React.createClass({
  getInitialState: function() {
  
    return {
      user1: 'Laura',
      user2: 'Bob',
      chatLog: [],
      userTyping: ''
    }
  },
  clearChatLog () {
    this.firebaseRef.remove();
    this.setState({chatLog: []})
  },
  updateChatLog (messageObject) {
    var chatLog = this.state.chatLog
    chatLog.push(messageObject)
    console.log('updatedChatLog:', chatLog)
    this.firebaseRef.push({
      message: messageObject
    });
    this.setState({chatLog: chatLog})
  },
  componentWillMount() {
    this.firebaseRef = firebase.database().ref('/items')
    this.firebaseRef.on('value', (dataSnapshot) => {
      const currentMessages = dataSnapshot.val();
      var chatLog = []
      for (var key in currentMessages) {
        chatLog.push(currentMessages[key].message)
      }
      this.setState({chatLog: chatLog})
      console.log('database chatLog: ', chatLog)

      console.log('currentMessages: ', currentMessages)
    })

  },
  clearUserTyping () {
    this.setState({userTyping: ''})
  },
  updateUserTyping (user) {
    this.setState({userTyping: user})
    _.debounce(this.clearUserTyping, 300)()
  },
  updateUser1(username) {
    this.setState({user1: username})
  },
  updateUser2(username) {
    this.setState({user2: username})
  },
  render () {
    console.log('test')
    return (
      <div className="app-container222">
        <div className="app-content222">
        <div className="clearChatLogButton" onClick={this.clearChatLog}>Clear Chat Log</div>
          <UserScreen
            user={this.state.user1}
            chatLog={this.state.chatLog}
            updateChatLog={this.updateChatLog}
            userTyping={this.state.userTyping}
            updateUserTyping={this.updateUserTyping}
            updateUser={this.updateUser1}
            alignUserScreen="alignUserScreenLeft"
            />
          <UserScreen
            user={this.state.user2}
            chatLog={this.state.chatLog}
            updateChatLog={this.updateChatLog}
            userTyping={this.state.userTyping}
            updateUserTyping={this.updateUserTyping}
            updateUser={this.updateUser2}
            alignUserScreen="alignUserScreenRight"
            />
        </div>
      </div>
    );
  }
})

export default App;