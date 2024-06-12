import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";

const Lists = () => {
    const location = useLocation();
    const [ movdata, setMovdata ] = useState(null);
    const { user, temMov } = location.state || {};
    useEffect(() => {
        setMovdata(temMov);
    }, [temMov])
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
    }, [movdata])

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
                //console.log('happened >',list_ids);
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
                    // Handle the fetched list data here
                } catch (error) {
                    console.error('Error fetching list data:', error);
                    // Handle error
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
        } catch(error) {
            console.log("ERROR : ", error);
        }
    }

    const handleAddSubmit = async () => {
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
            /*if (movdata)
            {
                setConfirm(updatedLists);
                console.log("CONFIRM : ", confirm);
                addtoList();
            }*/
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
        <div>
            {lists && lists.map((listName, index) => (
                <div key={index}>
                    <p onClick={() => handleEvent(listName)}>{listName[1]}</p>
                    {select && confirm == listName[0] ? <button onClick={()=>addtoList()}>Select</button> : null}
                </div>
            ))}
            {!showAddForm ? (
                <button onClick={handleAddList}>ADD</button>
            ) : (
                <div>
                    <input type="text" value={newListName} onChange={handleNewListNameChange} />
                    <button onClick={handleAddSubmit}>Submit</button>
                </div>
            )}
        </div>
    );
};

export default Lists;
