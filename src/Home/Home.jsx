import React, { useState } from 'react';
import Header from '../HomeCommon/Header';
import Footer from '../HomeCommon/Footer';

function Home() {
  const [isLoggedIn] = useState(false);
  const [ setSelectedNumber] = useState(null); 

  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

  const rows = [];
  for (let i = 0; i < numbers.length; i += 10) {
    rows.push(numbers.slice(i, i + 10));
  }
  const handleNumberSelect = (number) => {
    if (!isLoggedIn) {
      alert("User Not Loged in Please Login First...");
    } else {
      setSelectedNumber(number);
    }
  };




  return (
    <>
      <Header />
      <div className='main-home'>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="main-table mt-5">
                <div className="card-body">
                  <table className="table table-bordered" id="customeidbysqube">
                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((number, colIndex) => (
                            <td key={colIndex} onClick={() => handleNumberSelect(number)}>
                              {number}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
}

export default Home;
