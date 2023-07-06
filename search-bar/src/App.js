import React , {useState , useEffect , useRef} from 'react';
import './App.css';
import axios from 'axios';
function App() {
  // var axios = require("axios").default;
  const inputElement = useRef();
  const [data , setData] = useState([]);
  const [loading , setLoading] = useState(false);
  const [place , setPlace] = useState('');
  const [limit , setLimit] = useState(5);
  const [error , setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const input = document.querySelector('.search-input');
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '/' && event.ctrlKey) {
        event.preventDefault();
        inputElement.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const handlePlace = (e) => {
    if(e.target.value === "") return;
    setPlace(e.target.value);
  }

  const handleLimit = (e) => {
    if(e.target.value > 10){
      setError(true);
      return;
    }else{
      setLimit(e.target.value);
      setError(false);
    }
  }

  var options = {
    method: 'GET',
    url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
    params: {countryIds: 'IN', namePrefix: place, limit: limit},
    headers: {
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
      'x-rapidapi-key': '4ac5e3352fmshe6ac515ca3b8ccap1f0045jsnf0a504a87bbe'
    }
  };

  useEffect(() => {
    axios.request(options).then(function (response) {
      if(!response.data) setLoading(true);
      else{
        setData(response.data.data);
        setLoading(false);
        setTotalPages(Math.ceil(data.length / 5));
      };
    }).catch(function (error) {
      console.error(error);
    });

    console.log(data);

  },[place])


  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsToDisplay = data.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  return (
    <div className="container">
      <div className='search-bar'>
        <input  className="search-input" type="text"  placeholder='Search places...' onChange={(e) => handlePlace(e)}  ref={inputElement}/>
        <button className='key-short-cut'>Ctrl + /</button>
      </div>
      <div className='table-contant'>
        <table>
          <tr>
            <th>#</th>
            <th>Place Name</th>
            <th>Country</th>
          </tr>
           {loading ? <div className='spinner'>Loding...</div> : itemsToDisplay.map((item , index) => {
            return(
             <tr> 
               <td>{index + 1}</td>
               <td>{item.name}</td>
               <td>{item.country}</td>
             </tr>
            )
           })}
        </table>
      </div>

      {/* make pagination to show to */}

      <div className='pagination'>
         {data.length > 5 ? Array.from({length : totalPages} , (_ , i) => {
          return(
            <>
              <button
              disabled={i + 1 === currentPage}
              className={i + 1 === currentPage ? "pagination active" : "pagination"}
              onClick={() => handlePageChange(i + 1)}
              >
               {i + 1}
              </button>
            </>
          )
         }) : ""}
        <input type="number" min="5" max="10" placeholder='Limit' onChange={(e) => handleLimit(e)}/>
        {error ? <span className='error'>Limit can not exceed to greater then 10</span> : ""}
      </div>
    </div>
  );
}

export default App;
