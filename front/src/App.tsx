import * as React from "react";

// 画像のimport
import img_cracker from "./images/cracker.gif";

const apiServerUrl: string = "http://localhost:8080";
const calculaterGameEndpoint: string = apiServerUrl + "/api/math/calculater-game";
// const calculaterGameEndpoint: string = "/api/math/calculater-game";

/**
 * 計算ゲームのAPI取得データ型.
 */
type CalculaterGameData = {
  question: number;
  answer: string;
}

/** 小学１年生モード. */
const modeGrade1: string = 'grade1';

/** 小学2年生モード. */
const modeGrade2: string = 'grade2';

/** 小学3年生モード. */
const modeGrade3: string = 'grade3';

/** ボケ防止モード. */
const modePrevention: string = 'prevention';

/** No Limitモード. */
const modeNoLimit: string = 'nolimit';

/** モードMap. */
const modeMap: Map<String, string> = new Map([
  [modeGrade1, '?minNum=0&maxNum=20&maxResult=20&validOparation=plus,minus'],
  [modeGrade2, '?minNum=0&maxNum=9&maxResult=99&validOparation=plus,minus,multi,devide'],
  [modeGrade3, '?minNum=0&maxNum=99&maxResult=99&validOparation=plus,minus,multi,devide'],
  [modePrevention, '?minNum=2&maxNum=999&maxResult=1000&validOparation=plus,minus,multi,divide'],
  [modeNoLimit, '?minNum=0&maxNum=9999&maxResult=10000000&validOparation=plus,minus,multi,divide'],
]);

/** 連続で解く最大の問題数. */
const maxQuestionCount: number = 10;

const App: React.FC = () => {

  // state: 計算ゲームのモード
  const [calculaterGameMode, setCalculaterGameMode] = React.useState<string | null>(modeGrade1);

  // state: 計算ゲームのデータ
  const [calculaterGameData, setCalculaterGameData] = React.useState<CalculaterGameData | null>(null);

  // state: 現在の問題数
  const [questionCount, setQuestionCount] = React.useState<number>(1);

  // state: まちがえた回数
  const [failureCount, setFailureCount] = React.useState<number>(0);

  // state: せいかいしたか
  const [checkOk, setCheckOk] = React.useState<Boolean>(false);

  // state: まちがえたか
  const [checkNg, setCheckNg] = React.useState<Boolean>(false);

  // state: 結果modelを表示するか
  const [displayResult, setDisplayResult] = React.useState<Boolean>(false);

  // state: レベル設定Toastを表示するか
  const [displaySetting, setDisplaySettingToast] = React.useState<Boolean>(false);

  /**
   * 計算ゲーム用情報取得APIを叩いて、取得したデータでstate(calculaterGameData)を更新する.
   * 
   * @param mode 計算モード.
   * @param callback callback関数
   */
  const fetchData = async(mode: string | null, callback: Function | null): Promise<void> => {
    try {
      const modeUrl: string | undefined = mode ? modeMap.get(mode) : (
        calculaterGameMode ? modeMap.get(calculaterGameMode) : '');
      const res = await fetch(calculaterGameEndpoint + modeUrl);

      const json: React.SetStateAction<CalculaterGameData | null> = await res?.json();
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

    // undefined、nullの場合のみanswerが存在しないと捉える
    // (!answer)だと0が入ってきてもtrueになる
    if(answer === undefined || answer === null) {
      // answerが取得できていない場合はfetchし直す
      fetchData(null, null);
      return null;
    }

    // 入力値取得
    const inputList: NodeListOf<HTMLInputElement> = document.querySelectorAll('.js-input span') as NodeListOf<HTMLInputElement>;
    let inputedNumber: string = '';
    inputList.forEach((input) => inputedNumber += input.innerText)

    // 入力値と答えの比較
    if(answer == inputedNumber) {
      setCheckOk(true);
    } else {
      setCheckNg(true);
    }

  }

  /**
   * stateをリフレッシュし、新しい問題を取得する.
   */
  const refresh = () => {

    // stateのリフレッシュ
    setQuestionCount(0);
    setFailureCount(0);
    setDisplayResult(false);
    setCheckOk(false);
    setCheckNg(false);
    clearInput();
  }

  /**
   * 結果modelを表示する.
   */
  const displayResultModal = () => {
    setDisplayResult(true)
  }

  /**
   * 結果modal.
   * 
   * @returns ModalのDOM
   */
  function ResultModal() {
    return (
      <div className="m">
        <div className="m-overlay"></div>
        <div className="m-content">
          <img className="m-content__cracker" src={img_cracker} />
          <img className="m-content__cracker__reverse" src={img_cracker} />
          <p className="m-content__text">おつかれさまでした！</p>
          <p className="m-content__subText">まちがえた かいすうは <br />{failureCount}かい でした</p>

          {(failureCount == 0) && <p className="m-content__text">すばらしい！</p>}

          <button className="m-content__nextButton" onClick={() => {refresh(); fetchData(null, null);}}>もういちど</button>
        </div>
      </div>
    );
  }

  /**
   * 入力値のクリア.
   */
  const clearInput = () => {
    const inputed: HTMLInputElement = document.querySelector('.js-input') as HTMLInputElement;
    inputed.innerHTML = '';    
  }

  /**
   * つぎのもんだいを表示する.
   */
  const displayNextQuestion = (): void => {
    fetchData(null, () => {

      // 各modalを非表示に
      closeModal();

      // 入力値のクリア
      clearInput();

    });
  }

  /**
   * modalを閉じる
   */
  const closeModal = () => {

      // 各modalを非表示に
      if(checkOk) {
        setCheckOk(false);
      }
      if(checkNg) {
        setCheckNg(false);
      }
  }

  /**
   * OKマークを表示.
   * @returns OKマークDOM
   */
  function OkMark() {
    React.useEffect(() => {
      const timer = setTimeout(() => {

        if(maxQuestionCount <= questionCount) {
          // 問題数が最大値に達した場合、結果modalを表示する
          displayResultModal();

        } else {
          // まだ問題数が上限に達していない時、
          // つぎの問題を表示して○を消し、入力値をクリアし、問題数を更新
          displayNextQuestion();
          setQuestionCount(questionCount + 1);
        }

      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    })
    return (
      <div className="ma js-ma">
        <p className="ma__text">◎</p>
      </div>
    );
  }

  /**
   * NGマークを表示.
   * @returns NGマークDOM
   */
  function NgMark() {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        // ×を消す
        closeModal();
        // まちがえた回数更新
        setFailureCount(failureCount + 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    })
    return (
      <div className="ma">
        <p className="ma__text">×</p>
      </div>
    );
  }

  /**
   * レベル設定トーストを表示する.
   */
  const displaySettingToast = () => {
    setDisplaySettingToast(true);
  }

  /**
   * 指定のモードに変更する.
   * 
   * @param mode モード文字列.
   */
  const changeMode = (mode: string) => {
    // modeを設定
    setCalculaterGameMode(() => {
      fetchData(mode, null);
      return mode;
    });
    // 各種stateのリフレッシュ
    refresh();
    // レベル設定トーストを閉じる
    setDisplaySettingToast(false);
  }

  /**
   * レベル設定トースト.
   * @returns 
   */
  function SettingToast() {
    return (
      <div className="s">
        <button className="s-button" onClick={() => changeMode(modeGrade1)}>小学１年生モード</button>
        <button className="s-button" onClick={() => changeMode(modeGrade2)}>小学２年生モード</button>
        <button className="s-button" onClick={() => changeMode(modeGrade3)}>小学３年生モード</button>
        <button className="s-button" onClick={() => changeMode(modePrevention)}>ボケ防止モード</button>
        <button className="s-button" onClick={() => changeMode(modeNoLimit)}>NO LIMIT！</button>
      </div>
    );
  }

  // useEffect：：関数の実行タイミングをReactのレンダリング後まで遅らせるHook.
  React.useEffect(() => {
    fetchData(null, null);
  }, []);

  return (
    <>
      {/* せいかいマーク表示 */}
      {checkOk && <OkMark />}

      {/* ざんねんマーク表示 */}
      {checkNg && <NgMark />}

      {/* 結果modal表示. */}
      {displayResult && <ResultModal />}

      <div className="container">
        <div className="q">
          <div className="q-text">
            <p className="q-text__main">もんだい</p>
            <p className="q-text__sub">{questionCount}もんめ</p>
          </div>
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
          <button className="a__checkAnswerButton" onClick={(): void => {checkAnswer(calculaterGameData?.answer)}}>こたえあわせ</button>
        </div>

        <button className="l-settingButton" onClick={() => {displaySettingToast()}}>ほかのレベルをみる</button>
        {/* レベル設定トースト. */}
        {displaySetting && <SettingToast />}

      </div>
    </>
  );
};

export default App;