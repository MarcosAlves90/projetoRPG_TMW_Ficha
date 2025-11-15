import { useEffect, useContext, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { UserContext } from "../../UserContext.jsx";
import { CloudUpload } from "lucide-react";

export default function ProfilePicUploader() {
  const { userData, setUserData } = useContext(UserContext);

  const handleElementChange = useCallback(
    (key) => (value) => {
      setUserData((prevUserData) => ({
        ...prevUserData,
        [key]: value,
      }));
    },
    [setUserData],
  );

  useEffect(() => {
    const handlePaste = async (event) => {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 150,
            useWebWorker: false,
            quality: 0.7,
            outputFormat: "image/jpeg",
          };

          try {
            const compressedFile = await imageCompression(file, options);
            if (compressedFile) {
              const reader = new FileReader();
              reader.onload = (e) => {
                handleElementChange("profilePic")(e.target.result);
              };
              reader.readAsDataURL(compressedFile);
            } else {
              console.error("Compression returned undefined.");
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [handleElementChange]);

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 150,
        useWebWorker: false,
        quality: 0.7,
        outputFormat: "image/jpeg",
      };

      try {
        const compressedFile = await imageCompression(file, options);
        if (compressedFile) {
          const reader = new FileReader();
          reader.onload = (e) => {
            handleElementChange("profilePic")(e.target.result);
          };
          reader.readAsDataURL(compressedFile);
        } else {
          console.error("Compression returned undefined.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="profile-pic-image w-full h-full block">
      <label
        htmlFor="file-upload"
        className="group relative block w-full h-full cursor-pointer rounded-lg overflow-hidden"
        aria-hidden={false}
      >
        <img
          src={userData.profilePic || "./images/rgPlaceholder.jpg"}
          alt="Foto do perfil"
          className={`image-profile ${userData.profilePic ? "active" : ""} object-cover w-full h-full block`}
        />

        <div className="absolute inset-0 bg-zinc-900/30 rounded-lg opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100 pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100 pointer-events-none">
          <div className="p-2 rounded-md bg-blue-600/10 text-sky-400">
            <CloudUpload size={48} color="#60a5fa" strokeWidth={1.5} />
          </div>
        </div>

        <span className="sr-only">Carregar foto do perfil</span>
      </label>

      <input
        id="file-upload"
        type="file"
        className="sr-only"
        onChange={handleFileChange}
        accept="image/*"
        aria-label="Carregar foto do perfil"
      />
    </div>
  );
}
