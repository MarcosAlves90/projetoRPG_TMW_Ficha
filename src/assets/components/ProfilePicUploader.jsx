import { useEffect, useState } from "react";
import { deleteItem, getItem, saveItem } from "../systems/SaveLoad.jsx";
import imageCompression from 'browser-image-compression';

/**
 * `ProfilePicUploader` is a React component that allows users to upload and compress an image to be used as a profile picture.
 * It utilizes local storage to save and retrieve the profile picture. Upon selecting an image, it compresses the image
 * to a maximum size of 0.5MB and a maximum width or height of 150px, then converts it to a JPEG format with a quality of 0.7.
 * The compressed image is then stored in local storage and displayed as the user's profile picture.
 */
export default function ProfilePicUploader() {
    // State to hold the profile picture URL.
    const [profilePic, setProfilePic] = useState(getItem('profilePic', ''));

    // Effect to update local storage whenever the profile picture changes.
    useEffect(() => {
        // Save the profile picture to local storage if it exists, otherwise delete it from local storage.
        profilePic ? saveItem('profilePic', profilePic) : deleteItem('profilePic');
    }, [profilePic]);

    /**
     * Handles file selection and compresses the selected image.
     * @param {Event} event - The event triggered by file input change.
     */
    const handleFileChange = async (event) => {
        const file = event.target.files[0]; // Get the selected file.
        if (file) {
            // Options for image compression.
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 150,
                useWebWorker: false,
                quality: 0.7,
                outputFormat: 'image/jpeg'
            };

            try {
                // Compress the image file.
                const compressedFile = await imageCompression(file, options);
                if (compressedFile) {
                    // Read the compressed file and update the profile picture state.
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setProfilePic(e.target.result);
                        saveItem('profilePic', e.target.result); // Save the compressed image to local storage.
                    };
                    reader.readAsDataURL(compressedFile);
                } else {
                    console.error('Compression returned undefined.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="profile-pic-image">
            <label htmlFor="file-upload" className="custom-file-upload">
                <img
                    src={profilePic || 'src/assets/images/rg_placeholder.png'}
                    alt="Profile"
                    className="profile-pic"
                    style={{ width: '150px', height: '150px', cursor: 'pointer' }}
                />
            </label>
            <input
                id="file-upload"
                type="file"
                className="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
            />
        </div>
    );
}