import {useEffect, useContext} from "react";
import imageCompression from 'browser-image-compression';
import {UserContext} from "../../UserContext.jsx";
// MUI removed — using inline icon and native container
import styled from 'styled-components';

const StyledLabel = styled.label`
    position: relative;

    .filter {
        transition: all 0.2s ease-in-out;
        border-radius: 10px 0 0 10px;
        border: 4px solid transparent;
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background-color: rgba(23, 29, 46, 0.29);
    }

    .uploadIcon {
        transition: all 0.2s ease-in-out;
        opacity: 0;
        width: 6rem;
        height: 6rem;
        position: absolute;
        pointer-events: none;
        fill: white;
        z-index: 5;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &:hover {
        .uploadIcon, .filter {
            opacity: 1;
        }
    }
`;

export default function ProfilePicUploader() {
    const {userData, setUserData} = useContext(UserContext);

    const handleElementChange = (key) => (value) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            [key]: value,
        }));
    };

    useEffect(() => {
        const handlePaste = async (event) => {
            const items = event.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
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
                                handleElementChange('profilePic')(e.target.result);
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
        };

        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, []);

    async function handleFileChange(event) {
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
                        handleElementChange('profilePic')(e.target.result);
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
            <StyledLabel htmlFor="file-upload" className="custom-file-upload">
                <span className={"uploadIcon"}>📤</span>
                <div className={"filter"}/>
                <img
                    src={userData.profilePic || './images/rgPlaceholder.jpg'}
                    alt="Profile"
                    className={`image-profile ${userData.profilePic ? 'active' : ''}`}
                    style={{cursor: 'pointer'}}
                />
            </StyledLabel>
            <input
                id="file-upload"
                type="file"
                className="file-upload"
                style={{display: 'none'}}
                onChange={handleFileChange}
                accept="image/*"
            />
        </div>
    );
}