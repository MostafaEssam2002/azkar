import { useEffect, useRef } from 'react'
// import './App.css'
import getData from './api/getData';
import Morning from './pages/Morning';
import RowZekr from './components/RowZekr';

function App() {
  const hasFetched = useRef(false);

  
  useEffect(()=>{
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchData = async ()=>{
      const result = await getData("https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json")
      console.log(result);
    }
    fetchData()
  },[])
  return (
    <>
      <h1>Hello world </h1>
      <Morning />
      <RowZekr />
    </>
  )
}

export default App
