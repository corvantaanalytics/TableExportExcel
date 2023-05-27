import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './EnhetsregisteretPage.css';
import * as XLSX from 'xlsx';

const EnhetsregisteretPage = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef(null);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://data.brreg.no/enhetsregisteret/api/enheter'
      );
      setData(response.data._embedded.enheter);
      console.log("data",response.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* to export the whole json */

  // const handleExport = () => {
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Enhetsregisteret');
  //   XLSX.writeFile(workbook, 'enhetsregisteret_data.xlsx');
  // };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((item) =>
    item.navn.toLowerCase().includes(searchTerm.toLowerCase())
    
  );

    /* to export only the values from the filteredData */

  const handleExport = () => {
    
    const values = filteredData.map((item) => [item.navn, item.organisasjonsnummer, item.organisasjonsform.kode,
      item.organisasjonsform.beskrivelse, item._links.self.href
    ]);
  
    const worksheet = XLSX.utils.aoa_to_sheet(values);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Enhetsregisteret');
    XLSX.writeFile(workbook, 'enhetsregisteret_data.xlsx');
  };

  useEffect(() => {
    const tableContainer = tableRef.current;
    if (tableContainer) {
      const tableHeader = tableContainer.querySelector('thead');
      const firstColumnCells = tableContainer.querySelectorAll('tbody td:first-child');

      const handleScroll = () => {
        const scrollTop = tableContainer.scrollTop;
        tableHeader.style.transform = `translateY(${scrollTop}px)`;
        firstColumnCells.forEach((cell) => {
          cell.style.transform = `translateX(${tableContainer.scrollLeft}px)`;
        });
      };

      tableContainer.addEventListener('scroll', handleScroll);
      return () => {
        tableContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
<div className='page'>
    <div className="table-container" >
        
      <h1 >Enhetsregisteret API</h1>
      <div className="search-container">
        {console.log("Filtered Data", filteredData)}
        <input
          type="text"
          placeholder="Search by Org name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="export-button" onClick={handleExport}>
          Export to Excel
        </button>
      </div>
      <div className="table-container" ref={tableRef}>
      <table className="enhetsregisteret-table">
        <thead>
          <tr>
          <th className="table-header frozen-column">Organization Number</th>
            <th>Organization Name</th>
            <th>Organization Code</th>
            <th>Description</th>
            <th>Links</th>
            

            

          </tr>
        </thead>
        <tbody>
            
          {filteredData.map((item) => (
            <tr key={item.organisasjonsnummer} className="table-row">
              
              <td>{item.organisasjonsnummer}</td>
              <td>{item.navn}</td>
              <td>{item.organisasjonsform.kode}</td>
              <td>{item.organisasjonsform.beskrivelse}</td>
              <td>{item._links.self.href}</td>




            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    </div>
  );
};

export default EnhetsregisteretPage;
