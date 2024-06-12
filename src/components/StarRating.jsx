import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';

const StarRating = (details) => {
    const user = details.user;
    const movie = details.data;
    const rating = [1,2,3,4,5];
    const [rate, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    useEffect(() => {
        console.log("USER : ", user);
        console.log('SELECTED MOVIE : ', movie)
        console.log("Rating to be Updated : ", rate);
        async function addingRating(){
        try {
            const response = await fetch(`http://localhost:3001/addRating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email : user.email, movie_ID : movie.id, rating: rate})
            });
            if (!response.ok) {
                throw new Error('Network Response was not ok');
            }
        } catch (error) {
            console.log(error);
        }
        }
        addingRating();
    }, [rate]);
    
    return (
        <div>
        {rating.map((_, index)=>{
            const ratingValue = index + 1;
            return (
                <FaStar key={index}
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHoverRating(ratingValue)}
                onMouseLeave={() => setHoverRating(0)}
                color={(hoverRating || rate) >= ratingValue ? 'yellow' : 'grey'}
                style={{ cursor: 'pointer', marginRight: 10 }}
                />
            )
        })} 
        </div>
    )

}

export default StarRating;