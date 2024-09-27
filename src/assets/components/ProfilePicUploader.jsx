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
    const [profilePic, setProfilePic] = useState(getItem('profilePic', ''));

    useEffect(() => {
        profilePic ? saveItem('profilePic', profilePic) : deleteItem('profilePic');
    }, [profilePic]);

    /**
     * Handles file selection and compresses the selected image.
     * @param {Event} event - The event triggered by file input change.
     */
    async function handleFileChange (event) {
        const file = event.target.files[0];
        if (file) {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 150,
                useWebWorker: false,
                quality: 0.7,
                outputFormat: 'image/jpeg'
            };

            try {
                const compressedFile = await imageCompression(file, options);
                if (compressedFile) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setProfilePic(e.target.result);
                        saveItem('profilePic', e.target.result);
                    };
                    reader.readAsDataURL(compressedFile);
                } else {
                    console.error('Compression returned undefined.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className="profile-pic-image">
            <label htmlFor="file-upload" className="custom-file-upload">
                <img
                    src={profilePic || './images/rgPlaceholder.jpg'}
                    alt="Profile"
                    className={`image-profile ${profilePic ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
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