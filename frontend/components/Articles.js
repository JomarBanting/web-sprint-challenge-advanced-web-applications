import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PT from 'prop-types'
import ArticleForm from './ArticleForm';

export default function Articles(props) {
  const { articles, setCurrentArticleId, getArticles, currentArticleId, setEditStatus, editStatus, setCurrentArticle, deleteArticle} = props;
  const [edit, setEdit] = useState(editStatus);
  // ✨ where are my props? Destructure them here

  // ✨ implement conditional logic: if no token exists
  // we should render a Navigate to login screen (React Router v.6)
  const handleEdit = (data) => {
  setCurrentArticleId(data.article_id)
  setEditStatus(true);
  setEdit(true)
  setCurrentArticle(data)
  }

  const handleDelete = (id) => {
    deleteArticle(id);
  }

  useEffect(() => {
    // ✨ grab the articles here, on first render only
    getArticles();
  }, [])

  

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        !articles.length
          ? 'No articles yet'
          : articles.map(art => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button disabled={edit} onClick={() => handleEdit(art)}>Edit</button>
                  <button disabled={edit} onClick={() => handleDelete(art.article_id)}>Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
