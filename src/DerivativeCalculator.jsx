import { useState } from 'react';
import Plot from 'react-plotly.js';
import * as math from 'mathjs';

export const DerivativeCalculator = () => {
  const [func, setFunc] = useState('');
  const [result, setResult] = useState('');
  const [plotData, setPlotData] = useState({ x: [], y: [], yDerivative: [] });

  const calculateDerivative = () => {
    try {
      const expression = math.compile(func);
      const derivative = math.derivative(func, 'x');
      const funcDerivative = derivative.toString();
      setResult(funcDerivative);

      // Gerar dados para o gráfico
      const xValues = math.range(-10, 10, 0.1).toArray();
      const yValues = xValues.map((x) => expression.evaluate({ x }));
      const yDerivativeValues = xValues.map((x) => derivative.evaluate({ x }));

      setPlotData({
        x: xValues,
        y: yValues,
        yDerivative: yDerivativeValues,
      });
    } catch (error) {
      setResult('Erro ao calcular a derivada');
      setPlotData({ x: [], y: [], yDerivative: [] });
    }
  };

  const handleInputChange = (event) => {
    setFunc(event.target.value);
  };

  return (
    <div className="calculator-container">
      <h2>Calculadora de Derivada</h2>
      <div className="input-section">
        <label htmlFor="function-input">Insira a função (em termos de x):</label>
        <input
          type="text"
          id="function-input"
          value={func}
          onChange={handleInputChange}
          placeholder="Ex: sin(x), x^2 + 3x + 2"
        />
        <button onClick={calculateDerivative}>Calcular Derivada</button>
        {result && <p>Derivada: {result}</p>}
      </div>
      {plotData.x.length > 0 && (
        <div className="plot-section">
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'lines',
                name: 'Função',
                x: plotData.x,
                y: plotData.y,
                marker: { color: 'blue' },
              },
              {
                type: 'scatter',
                mode: 'lines',
                name: 'Derivada',
                x: plotData.x,
                y: plotData.yDerivative,
                marker: { color: 'red' },
              },
            ]}
            layout={{
              width: '100%',
              height: '100%', // Alterado para ocupar toda a altura disponível
              title: 'Gráfico da Função e sua Derivada',
              autosize: true, // Permite o ajuste automático do tamanho do gráfico
              margin: {
                l: 40, // Margem esquerda
                r: 40, // Margem direita
                b: 40, // Margem inferior
                t: 80, // Margem superior
              },
              xaxis: {
                title: 'Eixo x',
              },
              yaxis: {
                title: 'Eixo y',
              },
            }}
            config={{ responsive: true }}
          />
        </div>
      )}
    </div>
  );
};