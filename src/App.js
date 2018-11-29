import React, { Component } from 'react'
import axios from 'axios'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      todos: []
    }
  }

  componentDidMount = () => {
    axios
      .get('https://one-list-api.herokuapp.com/items?access_token=axis-tolkien')
      .then(response => {
        this.setState({
          todos: response.data
        })
      })
  }

  taskIndex = id => {
    return this.state.todos.findIndex(obj => {
      return obj.id === parseInt(id)
    })
  }

  completeTask = event => {
    let id = event.target.dataset.id
    let newList = this.state.todos
    let taskIndex = this.taskIndex(id)
    if (!newList[taskIndex].complete) {
      event.target.className = 'completed'
      newList[taskIndex].complete = true
    } else {
      event.target.className = ''
      newList[taskIndex].complete = false
    }
    console.log(newList[taskIndex].complete)
    this.setState({
      todos: newList
    })
  }

  deleteTask = event => {
    event.preventDefault()
    let todoList = this.state.todos
    let id = event.target.dataset.id
    // let indexToDelete = this.taskIndex(id)
    // todoList.splice(indexToDelete, indexToDelete + 1)
    axios.delete(
      `https://one-list-api.herokuapp.com/items/${id}?access_token=axis-tolkien`
    )
    this.setState({
      todos: todoList
    })
    this.componentDidMount()

    // console.log(todoList)
  }

  newTask = event => {
    event.preventDefault()
    let newList = this.state.todos
    let title = event.target.elements['taskInput'].value
    let newId = newList[newList.length - 1].id + 1
    axios.post(
      'https://one-list-api.herokuapp.com/items?access_token=axis-tolkien',
      {
        id: newId,
        text: title,
        complete: false
      }
    )
    // newList.push({
    //   id: newId,
    //   text: title,
    //   complete: false
    // })
    event.target.elements['taskInput'].value = ''
    this.setState({
      todos: newList
    })
    this.componentDidMount()
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>One List</h1>
        </header>
        <main>
          <ul className="one-list">
            {[...this.state.todos].map(todo => {
              return (
                <li
                  key={todo.id}
                  data-id={todo.id}
                  className="test"
                  onClick={this.completeTask}
                  onContextMenu={this.deleteTask}
                >
                  {todo.text}
                </li>
              )
            })}
          </ul>
          <form onSubmit={this.newTask}>
            <input type="text" name="taskInput" placeholder="Whats up?" />
          </form>
        </main>
        <footer>
          <p>
            <img src={logo} height="42" alt="logo" />
          </p>
          <p>&copy; 2018 Suncoast Developers Guild</p>
        </footer>
      </div>
    )
  }
}

export default App
