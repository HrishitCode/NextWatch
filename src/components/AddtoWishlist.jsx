import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddtoWishlist = ({ user, data }) => {
    const navigate = useNavigate();
    console.log(user);
  const sendData = async (user) => {
    try {
      const response = await fetch('http://localhost:3001/addWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, mvid: data.id })
      });
      if (!response.ok) {
        throw new Error('Network Response was not ok');
      }
      Swal.fire({
        icon: 'success',
        title: 'Added to Wishlist',
        text: 'The movie has been successfully added to your wishlist!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an issue adding the movie to your wishlist. Please try again later.',
      });
      console.log('Error sending data', error);
    }
  };

  useEffect(() => {
    if (user) {
      sendData(user);
    }
  }, [user]);

  return null;
};

export default AddtoWishlist;
