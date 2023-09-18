import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from "axios";
import axiosWithAuth from '../axios'
import PrivateRoute from '../axios/PrivateRoute'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState("")
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [linkDisabled, setLinkDisabled] = useState(true);
  const [editStatus, setEditStatus] = useState(false);

  const [currentArticle, setCurrentArticle] = useState("");


  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate("/") }
  const redirectToArticles = () => { navigate("/articles") }

  const linkStatus = (e) => {
    if (linkDisabled) e.preventDefault();
  }


  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    setLinkDisabled(true);
    localStorage.removeItem("token");
    setMessage("Goodbye!")
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setLinkDisabled(false);
    setSpinnerOn(true);
    axios.post("http://localhost:9000/api/login", { "username": username, "password": password })
      .then(res => {
        setMessage(res.data.message);
        localStorage.setItem("token", res.data.token)
        redirectToArticles();
      }).catch(err => console.log(err))
  }

  const getArticles = (message = "") => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth().get("articles").then(res => {
      setArticles(res.data.articles)
      setMessage(message ? message : res.data.message)
      setSpinnerOn(false)
      setEditStatus(false);
    }).catch(err => console.log(err))
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    axiosWithAuth().post("articles", article).then(res => {
      getArticles(res.data.message);
    }).catch(err => console.log(err))
  }

  const updateArticle = (article_id, article) => {
    // ✨ implement
    // You got this!
    axiosWithAuth().put(`articles/${article_id}`, article)
    .then(res => {
      getArticles(res.data.message);
      setCurrentArticleId("");
      currentArticle("");
      setEditStatus(false);
    })
    .catch(err => console.log(err))
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setSpinnerOn(true);
    console.log(article_id)
    console.log(articles)
    axiosWithAuth().delete(`articles/${article_id}`)
    .then(res => {
      getArticles(res.data.message)
      setCurrentArticleId("");
      setSpinnerOn(false);
      currentArticle("");
    })
    .catch(err => console.log(err))
  }
  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={linkDisabled ? linkStatus : logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles" onClick={linkDisabled ? linkStatus : getArticles}>Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={<PrivateRoute>
            <ArticleForm setCurrentArticle={setCurrentArticle} currentArticle={currentArticle} editStatus={editStatus} articles={articles} currentArticleId={currentArticleId} postArticle={postArticle} getArticles={getArticles} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId}/>
            <Articles setCurrentArticle={setCurrentArticle} articles={articles} getArticles={getArticles} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} setEditStatus={setEditStatus} editStatus={editStatus} deleteArticle={deleteArticle} /></PrivateRoute>} />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
