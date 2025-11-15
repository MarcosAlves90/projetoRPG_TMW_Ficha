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
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Search from "@mui/icons-material/Search";
import ContentPasteGo from "@mui/icons-material/ContentPasteGo";
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

export default function Page4() {
  const [createSkill, setCreateSkill] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDomains, setActiveDomains] = useState([]);

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

  const handleElementChange = useCallback(
    (key) => (value) => {
      setUserData((prevUserData) => {
        if (prevUserData[key] === value) return prevUserData;
        return { ...prevUserData, [key]: value };
      });
    },
    [setUserData],
  );

  const saveSkills = useCallback(
    (newSkills) => {
      handleElementChange("skillsArray", newSkills);
    },
    [handleElementChange],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
  }, []);

  const openModal = useCallback((skill) => {
    setSelectedItem(skill);
    setLocalItem(skill);
    setIsOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (!selectedItem) {
      return console.error("Nenhuma skill selecionada para deletar!");
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      skillsArray: prevUserData.skillsArray.filter(
        (skill) => skill.id !== selectedItem.id,
      ),
    }));
    closeModal();
  }, [setUserData, closeModal, selectedItem]);

  const pasteRef = useRef(null);

  useEffect(() => {
    const handlePasteEvent = async (event) => {
      if (event.clipboardData) {
        const text = event.clipboardData.getData("text");
        try {
          const skill = JSON.parse(text);
          if (skill && skill.title && skill.id) {
            const newSkill = { ...skill, id: uuidv4() };
            setUserData((prevUserData) => {
              const updatedSkills = [
                ...(prevUserData.skillsArray || []),
                newSkill,
              ];
              saveSkills(updatedSkills);
              return { ...prevUserData, skillsArray: updatedSkills };
            });
            event.preventDefault();
          }
        } catch (err) {
          console.error("Invalid JSON data: ", err);
        }
      }
    };

    const element = pasteRef.current;
    element.addEventListener("paste", handlePasteEvent);
    return () => {
      element.removeEventListener("paste", handlePasteEvent);
    };
  }, [saveSkills, setUserData]);

  const handleCopy = useCallback(async () => {
    if (selectedItem) {
      await navigator.clipboard.writeText(JSON.stringify(selectedItem));
      console.log("Código da skill copiado para a área de transferência!");
    }
  }, [selectedItem]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const skill = JSON.parse(text);
      const newSkill = { ...skill, id: uuidv4() };
      setUserData((prevUserData) => ({
        ...prevUserData,
        skillsArray: [...(prevUserData.skillsArray || []), newSkill],
      }));
    } catch (err) {
      console.error("Falha ao colar a skill: ", err);
    }
  }, [setUserData]);

  const clearInput = useCallback(() => {
    setCreateSkill("");
  }, []);

  const uniqueDomains = useMemo(() => {
    const domains = (userData.skillsArray || [])
      .filter((skill) => skill.domain && skill.domain.trim() !== "")
      .flatMap((skill) =>
        skill.domain
          .split(",")
          .map((domain) => domain.trim())
          .filter((domain) => domain !== ""),
      );
    return Array.from(new Set(domains));
  }, [userData.skillsArray]);

  const filteredSkills = useMemo(
    () =>
      (userData.skillsArray || []).filter((skill) => {
        const matchesSearchTerm =
          searchTerm === "" ||
          Object.values(skill).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
          );
        const skillDomains = skill.domain
          .split(",")
          .map((domain) => domain.trim())
          .filter((domain) => domain !== "");
        const matchesDomain =
          activeDomains.length === 0 ||
          activeDomains.some((domain) => skillDomains.includes(domain));
        return matchesSearchTerm && matchesDomain;
      }),
    [userData.skillsArray, searchTerm, activeDomains],
  );

  const searchByDomain = useCallback(
    (domain) => {
      const updatedDomains = activeDomains.includes(domain)
        ? activeDomains.filter((d) => d !== domain)
        : [...activeDomains, domain];

      setActiveDomains(updatedDomains);
    },
    [activeDomains],
  );

  const linkedDomains = useMemo(
    () => ["Fass", "Ris", "Xata", "Lohk", "Khra", "Netra", "Vome", "Jahu"],
    [],
  );

  const handleCreateSkill = useCallback(() => {
    const trimmedSkill = createSkill.trim();
    if (!trimmedSkill) return;

    const newSkill = {
      title: trimmedSkill,
      domain: "",
      content: "",
      circle: 1,
      type: 1,
      execution: 1,
      range: 1,
      target: "",
      duration: "",
      resistance: "",
      area: "",
      spent: "",
      id: uuidv4(),
    };

    setUserData((prevUserData) => ({
      ...prevUserData,
      skillsArray: [...(prevUserData.skillsArray || []), newSkill],
    }));
    clearInput();
  }, [createSkill, clearInput, setUserData]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setLocalItem((prevItem) => {
        const updatedItem = { ...prevItem, [name]: value };
        return updatedItem;
      });

      setUserData((prevUserData) => {
        const updatedItems = prevUserData.skillsArray.map((item) =>
          item.id === localItem.id ? { ...localItem, [name]: value } : item,
        );
        return { ...prevUserData, skillsArray: updatedItems };
      });
    },
    [localItem, setUserData],
  );

  const placeHolderImage =
    "https://pt.quizur.com/_image?href=https%3A%2F%2Fimg.quizur.com%2Ff%2Fimg5c40afdab16e93.66721106.png%3FlastEdited%3D1547743200&w=400&h=400&f=webp";

  const memoizedItems = useMemo(
    () =>
      (filteredSkills || []).map((skill) => (
        <div
          key={skill.id}
          className="skill skill-list"
          onClick={() => openModal(skill)}
        >
          <img
            className={`image ${!skill.image ? "image-placeholder" : ""}`}
            src={skill.image || placeHolderImage}
            alt="Skill"
          />
          <p className="title">{skill.title.toUpperCase()}</p>
        </div>
      )),
    [openModal, filteredSkills, placeHolderImage],
  );

  return (
    <>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="popup skill"
        overlayClassName="popupOverlay"
        bodyOpenClassName="no-scroll"
      >
        {localItem && (
          <>
            <i className="bi bi-x-lg closeButton" onClick={closeModal} />
            <div className="leftBoxWrapper">
              <div className="leftBox">
                <img
                  className={`image ${!localItem.image ? "image-placeholder" : ""}`}
                  src={localItem.image || placeHolderImage}
                  alt="Item"
                />
              </div>
              {window.innerWidth > 991 && (
                <TextField
                  value={localItem.image}
                  fullWidth
                  name="image"
                  className="popupInput"
                  onChange={handleInputChange}
                  variant="filled"
                  label="Link da imagem"
                />
              )}
            </div>
            <div className="rightBox">
              <input
                ref={inputRef}
                value={localItem.title}
                name="title"
                className="input title"
                onChange={handleInputChange}
                placeholder="Título do seu item."
              />
              <div className="topBox">
                <FormControl className="popupInput" variant="filled" fullWidth>
                  <InputLabel>Círculo</InputLabel>
                  <Select
                    value={localItem.circle || ""}
                    onChange={handleInputChange}
                    name="circle"
                  >
                    <MenuItem value={1}>1° Círculo</MenuItem>
                    <MenuItem value={2}>2° Círculo</MenuItem>
                    <MenuItem value={3}>3° Círculo</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className="popupInput" variant="filled" fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={localItem.type || ""}
                    onChange={handleInputChange}
                    name="type"
                  >
                    <MenuItem value={1}>Ativa</MenuItem>
                    <MenuItem value={2}>Passiva</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  variant="filled"
                  type="text"
                  onChange={handleInputChange}
                  value={localItem.spent}
                  label="Gasto"
                  name="spent"
                  className="popupInput"
                />
                <FormControl className="popupInput" variant="filled" fullWidth>
                  <InputLabel>Execução</InputLabel>
                  <Select
                    value={localItem.execution || ""}
                    onChange={handleInputChange}
                    name="execution"
                  >
                    <MenuItem value={1}>Padrão</MenuItem>
                    <MenuItem value={2}>Livre</MenuItem>
                    <MenuItem value={3}>Completa</MenuItem>
                    <MenuItem value={4}>Reação</MenuItem>
                    <MenuItem value={5}>Movimento</MenuItem>
                    <MenuItem value={6}>Outros</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className="popupInput" variant="filled" fullWidth>
                  <InputLabel>Alcance</InputLabel>
                  <Select
                    value={localItem.range || ""}
                    onChange={handleInputChange}
                    name="range"
                  >
                    <MenuItem value={1}>Pessoal</MenuItem>
                    <MenuItem value={2}>Toque</MenuItem>
                    <MenuItem value={3}>Curto</MenuItem>
                    <MenuItem value={4}>Médio</MenuItem>
                    <MenuItem value={5}>Longo</MenuItem>
                    <MenuItem value={6}>Extremo</MenuItem>
                    <MenuItem value={7}>Ilimitado</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  variant="filled"
                  type={"text"}
                  onChange={handleInputChange}
                  value={localItem.area}
                  label={"Área"}
                  name="area"
                  className="popupInput"
                />
                <TextField
                  type={"text"}
                  variant={"filled"}
                  onChange={handleInputChange}
                  value={localItem.target}
                  label={"Alvo"}
                  name="target"
                  className="popupInput"
                />
                <TextField
                  type={"text"}
                  variant={"filled"}
                  onChange={handleInputChange}
                  value={localItem.duration}
                  label={"Duração"}
                  className="popupInput"
                  name="duration"
                />
                <TextField
                  type={"text"}
                  variant={"filled"}
                  onChange={handleInputChange}
                  value={localItem.resistance}
                  label={"Resistência"}
                  name="resistance"
                  className="popupInput"
                />
              </div>
              <textarea
                className="popup-content textarea"
                value={localItem.content}
                name="content"
                onChange={handleInputChange}
                placeholder="Descrição da skill"
              />
              <TextField
                value={localItem.domain}
                fullWidth
                name="domain"
                className="popupInput"
                onChange={handleInputChange}
                variant={"filled"}
                label="Domínios"
              />
              {window.innerWidth <= 991 && (
                <TextField
                  value={localItem.image}
                  fullWidth
                  name="image"
                  className="popupInput"
                  onChange={handleInputChange}
                  variant="filled"
                  label="Link da imagem"
                />
              )}
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
      <main className="mainCommon page-4" ref={pasteRef}>
        <StyledInputsBox>
          <StyledTextField
            type="text"
            variant="outlined"
            placeholder="nome da skill..."
            value={createSkill}
            onChange={(event) => setCreateSkill(event.target.value)}
            fullWidth
          />
          <Box className={"buttonsBox"}>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleCreateSkill}
              endIcon={<AddCircle />}
            >
              Criar Skill
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handlePaste}
              endIcon={<ContentPasteGo />}
            >
              Colar Skill
            </StyledButton>
          </Box>
          <StyledTextField
            type="text"
            variant="outlined"
            placeholder="pesquisar skills..."
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

        <section className="tag-cloud display-flex-center">
          <span className={"tag qty"}>
            <i className="bi bi-archive-fill" />
            {`${
              userData.skillsArray ? userData.skillsArray.length : 0
            }/10 Skills`}
          </span>
          {uniqueDomains.map((domain) => {
            const isLinked = linkedDomains.includes(domain);
            const isReflex = domain.toLowerCase() === "reflexo";
            const displayDomain =
              domain.length > 40 ? `${domain.slice(0, 30)}...` : domain;
            return (
              <span
                key={domain}
                className={`tag 
                                    ${activeDomains.includes(domain) ? "active" : ""} 
                                    ${isLinked ? "linked" : ""} 
                                    ${isReflex ? "reflex" : ""}`}
                onClick={() => searchByDomain(domain)}
              >
                <i className="bi bi-stars" />
                {displayDomain}
              </span>
            );
          })}
        </section>

        <article className="boxSkills">{memoizedItems}</article>
      </main>
    </>
  );
}
