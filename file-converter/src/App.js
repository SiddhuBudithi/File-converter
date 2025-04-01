import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './Pages/Homepage.jsx'
import Upload from './Components/Uploads/Upload.jsx';
import FileList from './Components/FileList/FileList.jsx';
import ConvertFile from './Components/ConvertFile/ConvertFile.jsx';
import Login from './Components/Login/Login.jsx';
import Signup from './Components/Singup/Singup.jsx';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Homepage/>} />
    <Route path="/upload" element={<Upload/>} />
    <Route path="/filelist" element={<FileList/>} />
    <Route path="/convertfile" element={<ConvertFile/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/signup" element={<Signup/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;


