// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Lógica para recuperar comentarios asociados a postId
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/comments/${postId}`);
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

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
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      <h2 className="text-lx font-bold mb-4">Comments</h2>
      <p className="text-gray-500 mb-2">
        {comments.length === 1
          ? "1 comment"
          : comments.length > 1
          ? `${comments.length} comments`
          : "No comments"}
      </p>
      <ul className="list-none p-0">
        {comments.map((comment) => (
          <li key={comment.id} className="mb-4 border-b pb-2 bg-gray-200">
            {comment.user && (
              <p className="text-gray-800 font-gabarito">
                By: {comment.user.name} {comment.user.last_name}
              </p>
            )}
            <p className="text-gray-700">{comment.content}</p>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border rounded"
        ></textarea>
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-2 hover:bg-blue-700"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

Comments.propTypes = {
  postId: PropTypes.number.isRequired,
};

export default Comments;
