// src/pages/StudentDashboard.jsx
import { useEffect, useState } from 'react';
import API, { setAuthToken } from '../api/api';

export default function StudentDashboard(){
  const [bookings,setBookings] = useState([]);
  useEffect(()=>{
    const token = localStorage.getItem('token');
    setAuthToken(token);
    API.get('/bookings/my').then(r=>setBookings(r.data)).catch(()=>{});
  },[]);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.map(b => (
        <div key={b._id} className="border p-3 mb-2">
          <p>House: {b.house?.title}</p>
          <p>Amount: {b.amount}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}

