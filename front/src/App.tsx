import { equal } from "assert";
import * as React from "react";

// 画像のimport
import img_cracker from "./images/cracker.gif";

const apiServerUrl: string = "http://localhost:8080";
const calculaterGameEndpoint: string = apiServerUrl + "/api/math/calculater-game";
// const calculaterGameEndpoint: string = "/api/math/calculater-game";

type CalculaterGameData = {
  question: number;
  answer: string;
};

const App: React.FC = () => {
  
  // state: 計算ゲームのデータ
  const [calculaterGameData, setCalculaterGameData] = React.useState<CalculaterGameData | null>(null);

  // state: せいかいモーダルの状態
  const [checkOkModal, displayCheckOkModal] = React.useState<Boolean>(false);

  // state: ざんねんモーダルの状態
  const [checkNgModal, displayCheckNgModal] = React.useState<Boolean>(false);

  /**
   * 計算ゲーム用情報取得APIを叩いて、取得したデータでstate(calculaterGameData)を更新する.
   * 
   * @param callback callback関数
   */
  const fetchData = async(callback: Function | null): Promise<void> => {
    try {
      const res = await fetch(calculaterGameEndpoint);
      // const res = await fetch(calculaterGameEndpoint);
      const json: React.SetStateAction<CalculaterGameData | null> = await res.json();
      setCalculaterGameData(json);
    } catch (e: unknown) {
      console.error(e);
    } finally {

      // callback関数の実行
      if(callback) {
        callback();
      }
    }
  }

  /**
   * 押下したボタンの数値を入力する.
   * 
   * @param number 押下した数値.
   */
  const inputNumber = (number: number): void => {
    const inputArea: HTMLInputElement | null = document.querySelector('.js-input') as HTMLInputElement | null;
    if(inputArea) {
      inputArea.innerHTML += `<span>${number}</span>`;
    }
  }

  /**
   * 最後の１文字を消す.
   */
  const deleteLast = (): void => {
    const last: HTMLInputElement | null = document.querySelector('.js-input span:last-child') as HTMLInputElement | null;
    if(last) {
      last.remove();
    }
  }

  /**
   * 答え合わせをして、それに応じたモーダルを表示する.
   * 
   * @param answer 答え 
   * @returns 答え合わせ結果のDOM
   */
  const checkAnswer = (answer: string | undefined) => {

    if(!answer) {
      // answerが取得できていない場合はfetchし直す
      fetchData(null);
      return null;
    }

    // 入力値取得
    const inputList: NodeListOf<HTMLInputElement> = document.querySelectorAll('.js-input span') as NodeListOf<HTMLInputElement>;
    let inputedNumber: string = '';
    inputList.forEach((input) => inputedNumber += input.innerText)

    // 入力値と答えの比較
    if(answer == inputedNumber) {
      displayCheckOkModal(true);
    } else {
      displayCheckNgModal(true);
    }

  }

  /**
   * せいかいmodal.
   * 
   * @returns ModalのDOM
   */
  function OkModal() {
    return (
      <div className="m">
        <div className="m-overlay"></div>
        <div className="m-content">
          <img className="m-content__cracker" src={img_cracker} />
          <img className="m-content__cracker__reverse" src={img_cracker} />
          <p className="m-content__text">せいかい！</p>
          <p className="m-content__subText">よくできました</p>
          <button className="m-content__nextButton" onClick={displayNextQuestion}>つぎのもんだい</button>
        </div>
      </div>
    );
  }

  /**
   * ざんねんmodal.
   * 
   * @returns ModalのDOM
   */
  function NgModal() {
    return (
      <div className="m">
        <div className="m-overlay"></div>
        <div className="m-content">
          <p className="m-content__ng__text">ざんねん！</p>
          <p className="m-content__ng__subText">もういちど</p>
          <p className="m-content__ng__subText">かんがえよう</p>
          <button className="m-content__close" onClick={closeModal}>もどる</button>
        </div>
      </div>
    );
  }

  /**
   * つぎのもんだいを表示する.
   */
  const displayNextQuestion = (): void => {
    fetchData(() => {

      // 各modalを非表示に
      closeModal();

      // 入力値のクリア
      const inputed: HTMLInputElement = document.querySelector('.js-input') as HTMLInputElement;
      inputed.innerHTML = '';
    });
  }

  /**
   * modalを閉じる
   */
  const closeModal = () => {

      // 各modalを非表示に
      if(checkOkModal) {
        displayCheckOkModal(false);
      }
      if(checkNgModal) {
        displayCheckNgModal(false);
      }
  }

  // useEffect：：関数の実行タイミングをReactのレンダリング後まで遅らせるHook.
  React.useEffect(() => {
    fetchData(null);
  }, []);

  return (
    <>
      {/* せいかいモーダル(checkOkModalがtrueなら＜OkModal>を表示) */}
      {checkOkModal && <OkModal />}

      {/* ざんねんモーダル(checkNgModalがtrueなら＜NgModal>を表示) */}
      {checkNgModal && <NgModal />}

      <div className="container">
        <div className="q">
          <p className="q__text">もんだい</p>
          <div className="q-wrap">
            <p className="q-wrap__question">{calculaterGameData?.question}</p>
            <p className="q-wrap__text">=</p>
          </div>
        </div>

        <div className="i js-input">
        </div>

        <div className="b">
          <div>
            <button className="b__inputButton" onClick={(): void => {inputNumber(0)}}>0</button>
            <button className="b__inputButton" onClick={(): void => {inputNumber(1)}}>1</button>
            <button className="b__inputButton" onClick={(): void => {inputNumber(2)}}>2</button>
            <button className="b__inputButton" onClick={(): void => {inputNumber(3)}}>3</button>
            <button className="b__inputButton" onClick={(): void => {inputNumber(4)}}>4</button>
            <button className="b__inputButton" onClick={(): void => {inputNumber(5)}}>5</button>
            <button className="b__inputButton" onClick={(): void => {inputNumber(6)}}>6</button>
            <button className="b__inputButton" onClick={(): void => {inputNumber(7)}}>7</button>
            <button className="b__inputButton" onClick={(): void => {inputNumber(8)}}>8</button>
            <button className="b__inputButton" onClick={(): void => {inputNumber(9)}}>9</button>
            <button className="b__deleteLastButton" onClick={deleteLast}>１もじ けす</button>
          </div>
        </div>
        
        <div className="a">
          {/* <button className="a__button" onClick={displayAnswer}>こたえをみる</button>
          <div className="a-answer">
            <p className="a-answer__displayArea">こたえ：{calculaterGameData?.answer}</p>
            <button className="a-answer__nextButton" onClick={fetchData}>つぎのもんだい</button>
          </div> */}

          <button className="a__checkAnswerButton" onClick={(): void => {checkAnswer(calculaterGameData?.answer)}}>こたえあわせ</button>
        </div>
      </div>
    </>
  );
};

export default App;