import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EnhetsregisteretPage.css';
import * as XLSX from 'xlsx';

const EnhetsregisteretPage = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Enhetsregisteret');
    XLSX.writeFile(workbook, 'enhetsregisteret_data.xlsx');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((item) =>
    item.navn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <div className="table-container">
    <div className="enhetsregisteret-container">
      <h1>Enhetsregisteret API</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by organization name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="export-button" onClick={handleExport}>
          Export to Excel
        </button>
      </div>
      <table className="enhetsregisteret-table">
        <thead>
          <tr>
            <th>Organization Name</th>
            <th>Organization Number</th>
            <th>Organization Code</th>
            <th>registreringsdatoEnhetsregisteret</th>

          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.organisasjonsnummer}>
              
              <td>{item.organisasjonsnummer}</td>
              <td>{item.navn}</td>
              <td>{item.organisasjonsform.kode}</td>
              <td>{item.registreringsdatoEnhetsregisteret}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default EnhetsregisteretPage;
