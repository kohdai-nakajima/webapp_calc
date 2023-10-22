import * as React from "react";

const apiServerUrl: string = "http://localhost:8080";
const calculaterGameEndpoint: string = "/api/math/calculater-game";

type CalculaterGameData = {
  question: number;
  answer: string;
};

const displayAnswer = (event: React.MouseEvent<HTMLButtonElement>): void => {
  const answer: HTMLInputElement = document.querySelectorAll('.answer')[0] as HTMLInputElement;
  answer.style.display = 'block';

  const button: HTMLInputElement = document.querySelectorAll('.button')[0] as HTMLInputElement;
  button.style.display = 'none';
}

const App: React.FC = () => {
  const [calculaterGameData, setCalculaterGameData] = React.useState<CalculaterGameData | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiServerUrl + calculaterGameEndpoint);
        const json: React.SetStateAction<CalculaterGameData | null> = await res.json();
        setCalculaterGameData(json);
      } catch (e: unknown) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="question">
        <p>{calculaterGameData?.question}</p>
      </div>
      <button className="button" onClick={displayAnswer}>こたえを見る</button>
      <div className="answer">
        <p>こたえ：{calculaterGameData?.answer}</p>
      </div>
    </div>
  );
};

export default App;