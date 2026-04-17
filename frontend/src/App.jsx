import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home_Page from '../Pages/Home_Page'
function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Home_Page/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
     
  )
}

export default App
