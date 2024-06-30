import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ user, movie }) => {
    const rating = [1, 2, 3, 4, 5];
    const [rate, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [prevRate, setPrevRate] = useState(0);

    useEffect(() => {
        async function addingRating() {
            try {
                const response = await fetch(`http://localhost:3001/addRating`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.email, movie_ID: movie.id, rating: rate })
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (rate > 0) addingRating();
    }, [rate]);

    useEffect(() => {
        async function showRating() {
            try {
                const response = await fetch(`http://localhost:3001/showRating`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.email, movie_ID: movie.id })
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPrevRate(data.rating);
            } catch (error) {
                console.log(error);
            }
        }

        showRating();
        setRating(0); // Reset current rating
        setHoverRating(0); // Reset hover rating
    }, [movie.id]);

    return (
        <div className='flex'>
            {rating.map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <FaStar
                        key={index}
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        color={ratingValue <= (hoverRating || rate || prevRate) ? 'yellow' : 'grey'}
                        style={{ cursor: 'pointer', marginRight: 10 }}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;
