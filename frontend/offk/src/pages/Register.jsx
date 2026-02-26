// // src/pages/Register.jsx
// import { useState } from 'react';
// import API from '../api/api';
// import { useNavigate } from 'react-router-dom';

// export default function Register(){
//   const [form,setForm]=useState({ name:'', email:'', password:'', role:'student' });
//   const nav = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post('/users/register', form);
//       localStorage.setItem('token', res.data.token);
//       nav('/houses');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <form onSubmit={submit} className="bg-white p-6 rounded shadow w-80">
//         <h3 className="text-xl mb-3">Register</h3>
//         <input className="border p-2 mb-2 w-full" placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})} />
//         <input className="border p-2 mb-2 w-full" placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})} />
//         <input className="border p-2 mb-2 w-full" placeholder="Password" type="password" onChange={e=>setForm({...form,password:e.target.value})} />
//         <select className="border p-2 mb-2 w-full" onChange={e=>setForm({...form,role:e.target.value})}>
//           <option value="student">Student</option>
//           <option value="landlord">Landlord</option>
//         </select>
//         <button className="bg-blue-600 text-white p-2 w-full rounded">Register</button>
//       </form>
//     </div>
//   );
// }

// src/pages/Register.jsx
import { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', regNumber: '', password: '', role: 'student' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/houses');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h3>
        
        <input className="border p-2 mb-3 w-full rounded" placeholder="Full Name" required
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <select className="border p-2 mb-3 w-full rounded bg-white" 
          value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="landlord">Landlord</option>
        </select>

        {form.role === 'student' ? (
          <input className="border p-2 mb-3 w-full rounded" 
            placeholder="Reg Number (e.g. 20/45671U/5)" required
            onChange={e => setForm({ ...form, regNumber: e.target.value })} />
        ) : (
          <input className="border p-2 mb-3 w-full rounded" type="email"
            placeholder="Email Address" required
            onChange={e => setForm({ ...form, email: e.target.value })} />
        )}

        <input className="border p-2 mb-4 w-full rounded" placeholder="Password" type="password" required
          onChange={e => setForm({ ...form, password: e.target.value })} />

        <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 w-full rounded-lg font-semibold transition">
          Create Account
        </button>
      </form>
    </div>
  );
}
