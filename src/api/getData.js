const getData = async (url)=>{
    console.log("Fetching data from:", url);
    const res = await fetch(url)
    const data = await res.json()
    return data;
  } 
export default getData;