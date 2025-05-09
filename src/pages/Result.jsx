import React, { useEffect, useState } from 'react';

function Result() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Simulación de obtener el resultado desde la API
    fetch('http://localhost:5000/api/chat/result')
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch((err) => console.error('Error al obtener el resultado:', err));
  }, []);

  return (
    <div>
      <h1>Resultado</h1>
      {result ? (
        <div>
          <p>Correctas: {result.correct}</p>
          <p>Incorrectas: {result.incorrect}</p>
        </div>
      ) : (
        <p>Cargando resultados...</p>
      )}
    </div>
  );
}

export default Result;
