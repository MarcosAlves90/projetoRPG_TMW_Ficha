import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { saveUserData } from "../firebaseUtils.js";
import { UserContext } from "../UserContext";
import {
  StyledButton,
  StyledTextField,
} from "../assets/systems/CommonComponents.jsx";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Search from "@mui/icons-material/Search";
import AddCircle from "@mui/icons-material/AddCircle";
import styled from "styled-components";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

const StyledInputsBox = styled(Box)`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;

  .buttonsBox {
    display: flex;
    gap: 1rem;
  }

  @media (max-width: 991px) {
    flex-direction: column;
    gap: 2vw;
    margin: 2vw 0;
    .buttonsBox {
      gap: 2vw;

      button {
        width: 100%;
      }
    }
  }
`;

export default function Page5() {
  const [createTitle, setCreateTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [localItem, setLocalItem] = useState(null);
  const inputRef = useRef(null);

  const { userData, setUserData, user } = useContext(UserContext);
  const debounceTimeout = useRef(null);

  const saveDataDebounced = useCallback(
    (data) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        if (user) {
          saveUserData(data);
        }
      }, 500);
    },
    [user],
  );

  useEffect(() => {
    saveDataDebounced(userData);
  }, [userData, saveDataDebounced]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
  }, []);

  const openModal = useCallback((annotation) => {
    setSelectedItem(annotation);
    setLocalItem(annotation);
    setIsOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (!selectedItem) {
      return console.error("Nenhuma anotação selecionada para deletar!");
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      annotationsArray: prevUserData.annotationsArray.filter(
        (annotation) => annotation.id !== selectedItem.id,
      ),
    }));
    closeModal();
  }, [setUserData, closeModal, selectedItem]);

  const pasteRef = useRef(null);

  const handleCopy = useCallback(async () => {
    if (localItem) {
      await navigator.clipboard.writeText(localItem.content);
      console.log("Conteúdo da anotação copiado para a área de transferência!");
    }
  }, [localItem]);

  const clearInput = useCallback(() => {
    setCreateTitle("");
  }, []);

  const filteredAnnotations = useMemo(
    () =>
      (userData.annotationsArray || []).filter((annotation) => {
        const matchesSearchTerm =
          searchTerm === "" ||
          Object.values(annotation).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
          );
        return matchesSearchTerm;
      }),
    [userData.annotationsArray, searchTerm],
  );

  const handleCreateAnnotation = useCallback(() => {
    const trimmedTitle = createTitle.trim();
    if (!trimmedTitle) return;

    const newAnnotation = {
      title: trimmedTitle,
      content: "",
      id: uuidv4(),
    };

    setUserData((prevUserData) => ({
      ...prevUserData,
      annotationsArray: [
        ...(prevUserData.annotationsArray || []),
        newAnnotation,
      ],
    }));
    clearInput();
  }, [createTitle, clearInput, setUserData]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setLocalItem((prevItem) => {
        const updatedItem = { ...prevItem, [name]: value };
        return updatedItem;
      });

      setUserData((prevUserData) => {
        const updatedItems = prevUserData.annotationsArray.map((item) =>
          item.id === localItem.id ? { ...localItem, [name]: value } : item,
        );
        return { ...prevUserData, annotationsArray: updatedItems };
      });
    },
    [localItem, setUserData],
  );

  const placeHolderImage = useMemo(
    () =>
      "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vayUyMHBhZ2VzfGVufDB8fDB8fHww",
    [],
  );

  const memoizedItems = useMemo(
    () =>
      (filteredAnnotations || []).map((annotation) => (
        <div
          key={annotation.id}
          className="skill skill-list"
          onClick={() => openModal(annotation)}
        >
          <img
            className={`image image-placeholder`}
            src={placeHolderImage}
            alt="Anotação"
          />
          <p className="title">{annotation.title.toUpperCase()}</p>
        </div>
      )),
    [openModal, filteredAnnotations],
  );

  return (
    <>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="popup annotation"
        overlayClassName="popupOverlay"
        bodyOpenClassName="no-scroll"
      >
        {localItem && (
          <>
            <i className="bi bi-x-lg closeButton" onClick={closeModal} />
            <div className="rightBox">
              <input
                ref={inputRef}
                value={localItem.title}
                name="title"
                className="input title"
                onChange={handleInputChange}
                placeholder="Título da sua anotação."
              />
              <textarea
                className="popup-content textarea"
                value={localItem.content}
                name="content"
                onChange={handleInputChange}
                placeholder="Conteúdo da anotação"
              />
              <div className="boxButtons display-flex-center w-100">
                <button className="button delete" onClick={handleDelete}>
                  Deletar <i className="bi bi-trash3" />
                </button>
                <button className="button copy" onClick={handleCopy}>
                  Copiar <i className="bi bi-clipboard" />
                </button>
              </div>
            </div>
          </>
        )}
      </ReactModal>
      <main className="mainCommon page-5" ref={pasteRef}>
        <StyledInputsBox>
          <StyledTextField
            type="text"
            variant="outlined"
            fullWidth
            value={createTitle}
            onChange={(event) => setCreateTitle(event.target.value)}
            placeholder="título da anotação..."
          />
          <Box className="buttonsBox">
            <StyledButton
              className={"big-width"}
              variant="contained"
              color="primary"
              onClick={handleCreateAnnotation}
              endIcon={<AddCircle />}
            >
              Criar Anotação
            </StyledButton>
          </Box>
          <StyledTextField
            type="text"
            variant="outlined"
            placeholder="pesquisar anotações..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </StyledInputsBox>

        <article className="boxSkills annotations">{memoizedItems}</article>
      </main>
    </>
  );
}
