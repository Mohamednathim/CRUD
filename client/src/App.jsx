import { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setFilterusers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  // Get All Users
  const getAllUsers = async () => {
    await axios
      .get("http://localhost:4000/users")
      .then((res) => {
        setUsers(res.data);
        setFilterusers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Search Text
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filterUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterusers(filterUsers);
  };

  // Delete User
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you want to delete this user?");
    if (isConfirmed) {
      await axios.delete(`http://localhost:4000/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilterusers(res.data);
      });
    }
  };

  // close Model
  const closeModel = () => {
    setIsModelOpen(false);
    getAllUsers();
  };

  // Add User
  const handleAddUser = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModelOpen(true);
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      await axios
        .patch(`http://localhost:4000/users/${userData.id}`, userData)
        .then((res) => {
          console.log(res);
        });
    } else {
      await axios.post("http://localhost:4000/users", userData).then((res) => {
        console.log(res);
      });
    }
    closeModel();
    setUserData({ name: "", age: "", city: "" });
  };

  // Update User
  const handleUpdate = (user) => {
    setUserData(user);
    setIsModelOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3>CRUD OPERATION</h3>
        <div className="input-search">
          <input
            type="search"
            placeholder="Search Text Here"
            onChange={handleSearchChange}
          />
          <button className="btn blue" onClick={handleAddUser}>
            Add Record
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterusers &&
              filterusers.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td>
                      <button
                        className="btn green"
                        onClick={() => handleUpdate(user)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn red"
                        onClick={() => {
                          handleDelete(user.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {isModelOpen && (
          <div className="model">
            <div className="model-content">
              <span className="close" onClick={closeModel}>
                &times;
              </span>
              <h2>{userData.id ? "Update Record...🖋" : "Add Record...🖋"}</h2>
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  value={userData.name}
                  name="name"
                  id="name"
                  onChange={handleData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input
                  type="text"
                  value={userData.age}
                  name="age"
                  id="age"
                  onChange={handleData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  value={userData.city}
                  name="city"
                  id="city"
                  onChange={handleData}
                />
              </div>
              <button className="btn green" onClick={handleSubmit}>
                {userData.id ? "Update Record" : "Add Record"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
