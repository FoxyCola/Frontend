import { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';

const topics = ['Historia', 'Deporte', 'Comida', 'Cultura', 'Ciencia'];

const ChatPrompt = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        topic: selectedTopic,
      });
      const json = JSON.parse(res.data.response);
      setQuestions(json);
    } catch (err) {
      console.error(err);
      alert('Error al obtener preguntas');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index, option) => {
    setSelectedAnswers({ ...selectedAnswers, [index]: option });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4 flex items-center">
        <FaRobot className="mr-2" /> Generador de Preguntas
      </h1>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={`p-2 border rounded-lg ${
              selectedTopic === t ? 'bg-purple-600 text-white' : 'bg-gray-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !selectedTopic}
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
      >
        <FaPaperPlane className="inline mr-2" />
        Generar Preguntas
      </button>

      <div className="mt-6 space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="p-4 border rounded-lg bg-white shadow">
            <p className="font-medium mb-2">{i + 1}. {q.pregunta}</p>
            {q.opciones.map((op, j) => {
              const selected = selectedAnswers[i];
              const correct = selected === q.respuesta_correcta;
              const isSelected = selected === op;

              return (
                <button
                  key={j}
                  onClick={() => handleAnswer(i, op)}
                  disabled={!!selected}
                  className={`w-full text-left p-2 rounded border mb-1 ${
                    isSelected && correct
                      ? 'bg-green-100 border-green-400'
                      : isSelected && !correct
                      ? 'bg-red-100 border-red-400'
                      : 'bg-gray-100'
                  }`}
                >
                  {op}
                </button>
              );
            })}
            {selectedAnswers[i] && (
              <p className="mt-2 text-sm">
                {selectedAnswers[i] === q.respuesta_correcta
                  ? '✅ Correcto'
                  : `❌ Incorrecto. Respuesta correcta: ${q.respuesta_correcta}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPrompt;
