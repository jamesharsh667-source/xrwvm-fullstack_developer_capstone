import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../api';

const STATES = ['All', 'TX', 'IL', 'CO', 'FL', 'WA'];

function Dealers({ userName }) {
  const [dealers, setDealers] = useState([]);
  const [state, setState] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDealers = async () => {
      setLoading(true);
      setError('');
      try {
        const endpoint =
          state === 'All' ? `${API_BASE}/get_dealers` : `${API_BASE}/get_dealers/${state}`;
        const res = await fetch(endpoint);
        const data = await res.json();
        setDealers(data.dealers || []);
      } catch (e) {
        setError('Could not load dealers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDealers();
  }, [state]);

  return (
    <div className="container">
      <h1>Our Dealerships</h1>
      <div className="state-filter">
        <label htmlFor="state-select">Filter by state: </label>
        <select id="state-select" value={state} onChange={(e) => setState(e.target.value)}>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading dealers…</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && dealers.length > 0 && (
        <table className="dealers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Dealer Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Zip</th>
              <th>State</th>
              {userName && <th>Review Dealer</th>}
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr key={dealer.id}>
                <td>{dealer.id}</td>
                <td>
                  <Link to={`/dealer/${dealer.id}`} className="dealer-link">
                    {dealer.full_name}
                  </Link>
                </td>
                <td>{dealer.city}</td>
                <td>{dealer.street}</td>
                <td>{dealer.zip}</td>
                <td>{dealer.state}</td>
                {userName && (
                  <td>
                    <Link to={`/postreview/${dealer.id}`} className="review-btn">
                      Review Dealer
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && dealers.length === 0 && !error && <p>No dealers found for this state.</p>}
    </div>
  );
}

export default Dealers;
