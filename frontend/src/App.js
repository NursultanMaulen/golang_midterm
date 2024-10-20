import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage.js";
import TaskList from "./components/TaskList/TaskList.js";
import TaskDetails from "./components/TaskDetails/TaskDetails.js";
import PageNotFound from "./pages/NotFound/PageNotFound.js";

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route exact path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
