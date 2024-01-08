import * as React from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import Calculator from "./Calculator";
import { Top } from "./Top";
import "../css/CustomNavigator.css"
import Kanji from "./Kanji";

const CustomNavigator: React.FC = () => {
    return (
      <BrowserRouter>
        <ul className="custom-navigator">
          <li><Link to="/top">トップ</Link></li>
          <li><Link to="/calculator">計算</Link></li>
          <li><Link to="/kanji">漢字</Link></li>
        </ul>
        <Routes>
          <Route path="/top" element={<Top />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/kanji" element={<Kanji />} />
        </Routes>
      </BrowserRouter>

    );
};

export default CustomNavigator;