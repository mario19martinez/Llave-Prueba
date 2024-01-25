import { useState, useEffect } from "react";
import axios from "axios";

function Foro() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [userSub, setUserSub] = useState(null);
  const [responses, setResponses] = useState({});
  const [visibleResponses, setVisibleResponses] = useState({});

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserSub(response.data);
      } catch (error) {
        console.error("Error al obtener informacion del usuario:", error);
      }
    };
    getUserInfo();
    fetchQuestions();
  }, []);

  // useEffect(() => {
  //   fetchQuestions();
  // }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("/question");
      const sortedQuestions = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setQuestions(sortedQuestions);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    }
  };

  const handleNewQuestion = async () => {
    try {
      if (!userSub) {
        console.error("No se ha proporcionado un userId valido.");
        return;
      }

      const response = await axios.post("/question", {
        userSub: userSub.sub,
        text: newQuestion,
      });

      console.log("Respuesta del servidor:", response.data);
      //console.log(response);
      setNewQuestion("");
      fetchQuestions();
    } catch (error) {
      console.error("Error al publicar la pregunta:", error);
    }
  };

  const handleResponse = async (questionId, text) => {
    try {
      console.log("userSub:", userSub);
      //console.log('userSub:', userSub.sub)
      if (!userSub) {
        console.error("No se ha proporcionado un userId valido");
        return;
      }

      const response = await axios.post(`/question/${questionId}/answers`, {
        userSub: userSub.sub,
        text: text,
      });
      console.log("response:", response);
      console.log("userSub:", userSub);
      //console.log('response:', response)

      // Actualizamos el estado de las respuestas para la pregunta
      setResponses((prevResponses) => ({
        ...prevResponses,
        [questionId]: [...(prevResponses[questionId] || []), response.data],
      }));
    } catch (error) {
      console.error("Error al publicar la respuesta:", error);
      console.error("Error en la solicitud:", error.response.data);
    }
  };

  const toggleVisibleResponses = (questionId) => {
    setVisibleResponses((prevVisibleResponses) => ({
      ...prevVisibleResponses,
      [questionId]: !prevVisibleResponses[questionId],
    }));

    // Cargar respuestas si aun no estan cargadas
    if (!responses[questionId]) {
      fetchAnswers(questionId);
    }
  };

  const fetchAnswers = async (questionId) => {
    try {
      const response = await axios.get(`/question/${questionId}/answers`);
      setResponses((prevResponses) => ({
        ...prevResponses,
        [questionId]: response.data,
      }));
    } catch (error) {
      console.error("Error al obtener respuestas:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Preguntas & Respuestas</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="border p-2 mr-2 w-3/4"
          placeholder="Escribe tu pregunta..."
        />
        <button
          onClick={handleNewQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Hacer Pregunta
        </button>
      </div>
      <div>
        {questions && questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id} className="mb-8 border p-4">
              <p className="font-bold text-lg">Pregunta: {question.text}</p>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Tu respuesta"
                  className="border p-2 mr-2 w-3/4"
                  onChange={(e) =>
                    setResponses({
                      ...responses,
                      [question.id]: e.target.value,
                    })
                  }
                />
                <button
                  onClick={() =>
                    handleResponse(question.id, responses[question.id])
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Responder
                </button>
              </div>

              {visibleResponses[question.id] &&
              responses[question.id] &&
              Array.isArray(responses[question.id]) ? (
                <ul className="list-disc pl-6">
                  {responses[question.id].map((answer) => (
                    <div key={answer.id} className="text-gray-700">
                      <p className="text-gray-700 font-gabarito">
                        {answer.user?.name} {answer.user?.last_name}
                      </p>
                      <p className="text-gray-700">{answer.text}</p>
                    </div>
                  ))}
                </ul>
              ) : (
                <p>No hay respuestas para esta pregunta.</p>
              )}

              <button
                className="text-blue-500 cursor-pointer"
                onClick={() => toggleVisibleResponses(question.id)}
              >
                {visibleResponses[question.id] ? "Ocultar" : "Mostrar"}{" "}
                respuestas
              </button>
            </div>
          ))
        ) : (
          <p>No hay preguntas disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default Foro;
