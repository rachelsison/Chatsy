import React from 'react';
import UserScreen from './UserScreen';
import _ from 'lodash';
import './App.css';
import * as firebase from 'firebase';
import moment from 'moment'

var config = {
  apiKey: "AIzaSyBE88kR1qk1BcZ42m5qpxwEASbJbQ-Unrk",
  authDomain: "chatty-40852.firebaseapp.com",
  databaseURL: "https://chatty-40852.firebaseio.com",
  storageBucket: "chatty-40852.appspot.com",
  messagingSenderId: "1059490176611"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localUser: null,
      chatLog: [],
      userTyping: '',
      chatDate: null
    };
    this.clearChatLog = this.clearChatLog.bind(this);
    this.updateChatLog = this.updateChatLog.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderNamePrompt = this.renderNamePrompt.bind(this);
    this.updateUserTyping = this.updateUserTyping.bind(this);
    this.clearUserTyping = this.clearUserTyping.bind(this);
    this.render = this.render.bind(this);
  }
  
  clearChatLog () {
    this.firebaseRef.remove();
    this.setState({chatLog: []})
  }

  updateChatLog (messageObject) {
    var chatLog = this.state.chatLog
    chatLog.push(messageObject)
    console.log('updatedChatLog:', chatLog)
    this.firebaseRef.push({
      message: messageObject
    });
    this.setState({chatLog: chatLog})
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref('/items')
    this.firebaseRef.on('value', (dataSnapshot) => {
      const currentMessages = dataSnapshot.val();
      var chatLog = []
      for (var key in currentMessages) {
        chatLog.push(currentMessages[key].message)
      }
      this.setState({chatLog: chatLog, chatDate: moment().format('MMM Do, h:mm a')})
      console.log('database chatLog: ', chatLog)
      console.log('currentMessages: ', currentMessages)
    })
  }

  handleSubmit (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.setState({localUser: event.target.value})
      }
  }

  renderNamePrompt () {
    console.log('renderingNamePrompt')
    if (!this.state.localUser) {
      return (
        <div className="namePromptContainer">
          <div className="inputContainer">
            <input 
              className="textBoxInput"
              type="text"
              onKeyDown={this.handleSubmit}
              placeholder="Please enter your name to begin chat ..."
              />
          </div>
        </div>
      )
    }
  }

  clearUserTyping () {
    
    this.setState({userTyping: ''})
  }

  updateUserTyping (user) {
    this.setState({userTyping: user})
    _.debounce(this.clearUserTyping, 300)()
  }

  render () {
    console.log('test')
    console.log(this.firebaseRefc)
    return (
      <div className="app-container">
        <div className="app-content">
        <div className="clearChatLogButton" onClick={this.clearChatLog}>Clear Chat Log</div>
          {this.renderNamePrompt()}
          <UserScreen
            user={this.state.localUser}
            chatLog={this.state.chatLog}
            updateChatLog={this.updateChatLog}
            userTyping={this.state.userTyping}
            updateUserTyping={this.updateUserTyping}
            updateUser={this.updateUser1}
            chatDate={this.state.chatDate}
            />
        </div>
      </div>
    );
  }
};

export default App;