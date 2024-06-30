import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";
import StarRating from './StarRating'; // Assuming StarRating is a component you have
import ListMovies from "./ListMovies";
import Navbar from "./Navbar";

const Lists = () => {
    const location = useLocation();
    const [movdata, setMovdata] = useState(null);
    const { user, temMov } = location.state || {};
    useEffect(() => {
        setMovdata(temMov);
    }, [temMov]);
    console.log('chalo dekhte hain : ', movdata);
    const [lists, setLists] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [confirm, setConfirm] = useState(null);
    const [select, setSelect] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (movdata){
            setSelect(true);
        }
    }, [movdata]);

    useEffect(() => {
        const getData = async () => {
            try {    
                const response = await fetch(`http://localhost:3001/showUserlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify({ email: user.email })
                });
                if (!response.ok) {
                    throw new Error('Network Response was not ok');
                }
                const data = await response.json();
                const list_ids = data[0].list_id;
                const saveListPromises = list_ids.map(async (lid)=>{
                    const response = await fetch(`http://localhost:3001/showlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify({ id: lid })
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data1 = await response.json();
                console.log(data1);
                const mname = data1.Name;
                return [lid, mname];
                })

                try {
                    const listData = await Promise.all(saveListPromises);
                    setLists(listData);
                    console.log('List data:', lists);
                } catch (error) {
                    console.error('Error fetching list data:', error);
                }

            } catch(error) {
                console.log("ERROR : ", error);
            }
        }
        
        if (user) {
            getData();
        }
    }, [user]);

    const handleAddList = async () => {
        setShowAddForm(true);
    };

    const handleNewListNameChange = (event) => {
        setNewListName(event.target.value);
    };

    const addtoList = async () => {
        const datatoAdd = {listID : confirm, movie : movdata.id}
        try {
            const response = await fetch(`http://localhost:3001/addtolist`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(datatoAdd)
            });
            if (!response.ok) {
                throw new Error('Failed to add list');
            }
            const updatedLists = await response.json(); 
            console.log("ADDED to the list successfully");
            setConfirm(null);
            setSelect(false);
            setMovdata(null);
            navigate(`/user/list/${datatoAdd.listID}`, {state: {user : user, listid : datatoAdd.listID}})
        } catch(error) {
            console.log("ERROR : ", error);
        }
    }

    const handleAddSubmit = async () => {
        console.log("AARARarrarara");
        try {
            const response = await fetch(`http://localhost:3001/addlist`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({ email: user.email, newListName })
            });
            if (!response.ok) {
                throw new Error('Failed to add list');
            }
            const updatedLists = await response.json(); 
            console.log('updatedLists', updatedLists[1]);
            setLists(prevLists => [...prevLists, updatedLists]);
            setNewListName('');
            setShowAddForm(false);

        } catch(error) {
            console.log("ERROR : ", error);
        }
    };
    const handleEvent = (movd) =>
    {
        console.log(movd[0]);
        setConfirm(movd[0]);
    }
    return (
        <>
        {!movdata && <Navbar user={user}/>}
        <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-6">
            <h1 className="text-3xl font-semibold mb-4">{user.nickname}'s Lists</h1>
            {movdata && (
                <>
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold mb-2">{movdata.title}</h1>
                            <p className="text-base mb-4">{movdata.overview}</p>
                        </div>
                        <img className="w-48 h-auto ml-4" src={`https://image.tmdb.org/t/p/original/${movdata.poster_path}`} alt={movdata.title} />
                    </div>
                    <div className="mt-4">
                        <StarRating user={user} movie={movdata}/>
                    </div>
                </>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lists && lists.map((listName, index) => (
                    <div key={index} className="border border-gray-300 p-4 rounded-lg hover:shadow-md cursor-pointer flex items-center justify-between" onClick={() => handleEvent(listName)}>
                        <div className="flex items-center">
                            <div className="mr-3">
                                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h4a2 2 0 011.414.586L10 5h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1h-6.586l-.707-.707A1 1 0 009 5H4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p>{listName[1]}</p>
                        </div>
                        {select && confirm === listName[0] && (
                            <button onClick={addtoList} className="bg-blue-500 text-white px-4 py-2 rounded">Select</button>
                        )}
                        {!select && confirm === listName[0] && navigate(`/user/list/0`, {state: {user : user, listid : listName[0]}})}
                    </div>
                ))}
                {!showAddForm ? (
                    <button onClick={handleAddList} className="bg-green-500 text-white px-4 py-2 rounded">ADD</button>
                ) : (
                    <div>
                        <input 
                            type="text" 
                            value={newListName} 
                            onChange={handleNewListNameChange} 
                            className="border border-gray-300 p-2 rounded mb-2"
                        />
                        <button onClick={handleAddSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default Lists;
