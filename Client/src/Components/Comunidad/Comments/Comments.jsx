// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Logica para recuperar comentarios asociados a postId
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/comments/${postId}`);
        setComments(response.data.comments);
      }catch (error) {
        console.error('Error fetching comments:', error);
      }
    }

    fetchComments();
  }, [postId]);

  // useEffect(() => {
  //   fetchComments();
  // }, []);

  // const fetchComments = async () => {
  //   try {
  //     const response = await axios.get(`/comments/${postId}`);
  //     setComments(response.data.comments);
  //   } catch (error) {
  //     console.error("Error fetching comments:", error);
  //   }
  // };

  const handleAddComment = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
  
      const response = await axios.post(
        "/newComment",
        { postId, content: newComment },
        config
      );
  
      if (response.data && response.data.error) {
        console.error("Server error:", response.data.error);
        // Manejar el error de manera adecuada
      } else {
        setComments([...comments, response.data.comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
  
      // Imprimir la respuesta del servidor en la consola
      console.log("Server response:", error.response);
    }
  };
  

  const handleDeleteComment = async (commentId) => {
    try {
      const authToken = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      await axios.delete(`/deleteComment/${commentId}`, config);
      // Actualizar la lista de comentarios después de eliminar el comentario
      const updatedComments = comments.filter((comment) => comment.id !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        ></textarea>
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

Comments.propTypes = {
  postId: PropTypes.number.isRequired,
};

export default Comments;
