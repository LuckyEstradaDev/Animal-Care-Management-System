import { BrowserRouter, Routes, Route } from "react-router-dom";

import Website from '../Pages/Website_Page'

function App() {

  return (
    <>   
      <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Website/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
     
  )
}

export default App
