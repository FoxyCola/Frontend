import { useNavigate } from 'react-router-dom';
import './Home.css'; // Asegúrate de importar el archivo CSS

function Home() {
  const navigate = useNavigate();

  const topics = ['historia', 'deporte', 'comida', 'cultura', 'ciencia'];

  const handleTopicClick = (topic) => {
    navigate(`/quiz/${topic}`); // Redirige a la ruta del quiz con el tema seleccionado
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Selecciona un tema</h1>
      <div className="button-group">
        {topics.map((topic) => (
          <button key={topic} className="topic-button" onClick={() => handleTopicClick(topic)}>
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
