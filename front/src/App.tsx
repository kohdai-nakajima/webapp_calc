import * as React from "react";

// const apiServerUrl: string = "http://localhost:8080";
// const calculaterGameEndpoint: string = apiServerUrl + "/api/math/calculater-game";
const calculaterGameEndpoint: string = "/api/math/calculater-game";

type CalculaterGameData = {
  question: number;
  answer: string;
};

/**
 * シンプルに答えを表示するだけの処理.
 * 
 * @param event clickイベント.
 */
const displayAnswer = (event: React.MouseEvent<HTMLButtonElement>): void => {
  const answer: HTMLInputElement = document.querySelectorAll('.answer')[0] as HTMLInputElement;
  answer.style.display = 'block';

  const button: HTMLInputElement = document.querySelectorAll('.button')[0] as HTMLInputElement;
  button.style.display = 'none';
}

/**
 * シンプルに答えを隠すだけの処理.
 */
const hideAnswer = (): void => {
  const answer: HTMLInputElement = document.querySelectorAll('.answer')[0] as HTMLInputElement;
  answer.style.display = 'none';

  const button: HTMLInputElement = document.querySelectorAll('.button')[0] as HTMLInputElement;
  button.style.display = 'initial';
}

const App: React.FC = () => {
  const [calculaterGameData, setCalculaterGameData] = React.useState<CalculaterGameData | null>(null);

  /**
   * 計算ゲーム用情報取得APIを叩いて、取得したデータでstate(calculaterGameData)を更新する.
   */
  const fetchData = async(): Promise<void> => {
    try {
      const res = await fetch(calculaterGameEndpoint);
      // const res = await fetch(calculaterGameEndpoint);
      const json: React.SetStateAction<CalculaterGameData | null> = await res.json();
      setCalculaterGameData(json);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      // 答えを隠す
      hideAnswer();
    }
  }

  // useEffect：：関数の実行タイミングをReactのレンダリング後まで遅らせるHook.
  React.useEffect(() => {
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
        <button className="button" onClick={fetchData}>つぎのもんだい</button>
      </div>
    </div>
  );
};

export default App;