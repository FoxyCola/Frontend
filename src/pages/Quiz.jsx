import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Quiz() {
  const { topic } = useParams(); // Obtiene el parámetro 'topic' de la URL
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Lógica para obtener preguntas según el tema seleccionado
  useEffect(() => {
    fetch(`http://localhost:5000/api/quiz/${topic}`)
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error('Error fetching quiz questions:', error));
  }, [topic]);

  const handleAnswerChange = (questionIndex, option) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option; // Guarda la respuesta seleccionada para cada pregunta
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div>
      <h1>Cuestionario sobre {topic}</h1>
      {questions.length > 0 ? (
        <div>
          {questions.map((question, index) => (
            <div key={index}>
              <p>{question.question}</p>
              {question.options.map((option, i) => (
                <button key={i} onClick={() => handleAnswerChange(index, option)}>
                  {option}
                </button>
              ))}
            </div>
          ))}
          {!submitted && <button onClick={handleSubmit}>Enviar respuestas</button>}
          {submitted && (
            <div>
              <h2>Resultados</h2>
              {questions.map((question, index) => (
                <p key={index}>
                  {question.question} - Respuesta seleccionada: {answers[index]}
                </p>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Cargando preguntas...</p>
      )}
    </div>
  );
}

export default Quiz;
