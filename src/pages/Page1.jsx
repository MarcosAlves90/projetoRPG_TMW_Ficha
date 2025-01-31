import {useEffect, useRef, useCallback, useContext} from "react";
import ProfilePicUploader from "../assets/components/ProfilePicUploader.jsx";
import {saveUserData} from "../firebaseUtils.js";
import {UserContext} from "../UserContext.jsx";
import styled from 'styled-components';
import {Box, InputAdornment, TextField, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import {DirectionsRun, Casino, Cyclone, Favorite, FlashOn, Psychology, Shield} from '@mui/icons-material';

const StyledTextField = styled(TextField)`
    margin-top: 0;

    .MuiInputLabel-root, .MuiInputBase-input {
        font-family: var(--common-font-family), sans-serif !important;
    }

    & .MuiFilledInput-root {
        background-color: var(--background);
    }

    .Mui-disabled {
        background-color: var(--gray-border-color);
    }

    .MuiSvgIcon-root {
        opacity: 0.3;
    }

    @media (max-width: 991px) {
        & .MuiInputBase-input, .MuiInputLabel-root {
            font-size: 3.5vw;

        }
    }
`;

const StyledFormControl = styled(FormControl)`
    margin-top: 0;

    .MuiInputLabel-root, .MuiInputBase-input {
        font-family: var(--common-font-family), sans-serif !important;
        text-align: left;
    }

    & .MuiFilledInput-root {
        background-color: var(--background);
    }

    @media (max-width: 991px) {
        & .MuiInputBase-input, .MuiInputLabel-root {
            font-size: 3.5vw;
        }
    }
`;

const InputsFieldset = styled.fieldset`
    margin: 1.5rem;
    display: flex;
    gap: 2rem;

    .MuiBox-root {
        display: flex;
        width: 100%;
        gap: 0;
    }

    @media (max-width: 991px) {
        flex-direction: column;
        margin: 1rem;
        gap: 1rem;
    }
`;

const SectionCommon = styled.section`
    width: 100%;
    margin-bottom: 1rem;

    .title-2 {
        width: 100%;
        margin: 0;
        color: white;
        background-color: var(--gray-border-color);
        padding: 0.1rem;
    }

    .description-p {
        width: 100%;
        margin: 0 0 1rem 0;
        color: white;
        font-size: 0.8vw;
        opacity: 0.5;
    }

    &.sectionIdentity {
        padding: 0 2rem 2rem 2rem;
        width: 37rem;
        border-radius: 10px;
        background-color: rgba(23, 29, 46, 0.49);
        border: var(--gray-border);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        h3 {
            font-weight: bold;
            width: fit-content;
            padding: 0.5rem 1rem;
            background-color: var(--gray-border-color);
            border-radius: 0 0 10px 10px;
            margin-bottom: 1rem;
        }

        .pBox {
            margin-bottom: 1rem;
            color: var(--identity-outside-background);

            p {
                font-weight: bold;
                margin-bottom: 0.2rem;
            }

            p:last-child {
                margin-bottom: 0;
            }
        }

        .profile-pic-image {
            width: 11rem;
            height: 11rem;
            margin-right: 1rem;

            .custom-file-upload, .image-profile {
                width: 100%;
                height: 100%;
            }

            .image-profile {
                border-radius: 10px 0 0 10px;
                border: 4px solid #2a3554;
            }
        }

        .picBox {
            width: 100%;

            .textBox {
                background-color: var(--gray-border-color);
                padding: 0.5rem 1rem;
                text-align: left;
                border-radius: 0 10px 10px 0;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                p {
                    width: 100%;
                }

                p:last-child {
                    margin-bottom: 0;
                }
            }
        }

        @media (max-width: 991px) {
            width: fit-content;
            background-color: transparent;
            border: none;
            padding: 0;
            margin-bottom: 2rem;
            p, h3, .textBox {
                display: none !important;
            }

            .profile-pic-image {
                margin: 0;

                .image-profile, .filter {
                    border-radius: 50%;
                }
            }
        }
    }
    
    .flexBox {
        display: flex;
        gap: 2rem;
    }

    @media (max-width: 991px) {
        .title-2 {
            font-size: 4vw;
        }
        .flexBox {
            gap: 1rem;
        }
    }
`;

const StyledBoxField = styled(Box)`
    background-color: rgba(23, 29, 46, 0.49);
    border: var(--gray-border);
    border-radius: 10px;
    @media (max-width: 991px) {
        margin-bottom: 3rem;
    }
`;


export default function Page1() {
    const {userData, setUserData, user} = useContext(UserContext);
    const debounceTimeout = useRef(null);

    const saveDataDebounced = useCallback((data) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            if (user) {
                saveUserData(data);
            }
        }, 500);
    }, [user]);

    useEffect(() => {
        saveDataDebounced(userData);
    }, [userData, saveDataDebounced]);

    const handleInputChange = (key) => (event) => {
        const {value, type} = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [key]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
        }));
    };

    const localEnergy = useCallback(() => {
        const pre = userData["atributo-PRE"] || 0;
        const bioEnergy = userData["biotipo-Energia"] || 0;
        const energyMap = {1: 2, 2: 3, 3: 4};
        return (energyMap[bioEnergy] + pre) * userData.nivel || 0;
    }, [userData.nivel]);

    const localLife = useCallback(() => {
        const vig = userData["atributo-VIG"] || 0;
        const bioLife = userData["biotipo-Vida"] || 0;
        const lifeMap = {1: 12, 2: 16, 3: 20};
        return (lifeMap[bioLife] + vig) + ((userData.nivel - 1) * (lifeMap[bioLife] / 4 + vig)) || 0;
    }, [userData.nivel]);

    return (
        <main className="mainCommon page-1">
            <SectionCommon className={"sectionIdentity"}>
                <h3>IDENTIFICADOR</h3>
                <Box className={"pBox"}>
                    <p>REGIÃO DE AGAMEMNON</p>
                    <p>SECRETARIA DE SEGURANÇA PÚBLICA</p>
                    <p>INSTITUTO DE IDENTIFICAÇÃO</p>
                </Box>
                <Box className={"picBox d-flex"}>
                    <ProfilePicUploader/>
                    <Box className={"textBox"}>
                        <p><strong>Nome:</strong> {`${userData.nome || ''}`}</p>
                        <p><strong>Nascimento:</strong> {`${userData.idade || ''}`}</p>
                        <p><strong>Título:</strong> {`${userData.titulo || ''}`}</p>
                        <p><strong>Categoria:</strong> SSP-SEV</p>
                    </Box>
                </Box>
            </SectionCommon>

            <StyledBoxField>
                <SectionCommon>
                    <h2 className="mainCommon title-2">Pessoal</h2>
                    <InputsFieldset>
                        <StyledTextField variant="filled" label={"Nome"} fullWidth
                                         type="text" value={userData.nome || ''} onChange={handleInputChange('nome')}/>
                        <StyledTextField variant="filled" label={"Data de Nascimento"} fullWidth
                                         type="text" value={userData.idade || ''} onChange={handleInputChange('idade')}
                                         className="input-small"/>
                        <StyledTextField variant="filled" label={"Profissão"} fullWidth
                                         type="text" className="input-small" value={userData.profissao || ''}
                                         onChange={handleInputChange('profissao')}/>
                    </InputsFieldset>
                    <InputsFieldset>
                        <StyledTextField variant="filled" label={"Título"} fullWidth
                                         type="text" value={userData.titulo || ''}
                                         onChange={handleInputChange('titulo')}/>
                        <Box className={"flexBox"}>
                            <StyledTextField variant="filled" label={"Altura"} fullWidth
                                             slotProps={{
                                                 input: {
                                                     endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                                 },
                                             }}
                                             type="number" value={userData.altura || ''}
                                             onChange={handleInputChange('altura')}
                                             min={0} step={0.01} className="input-small"/>
                            <StyledTextField variant="filled" label={"Peso"} fullWidth
                                             slotProps={{
                                                 input: {
                                                     endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                                 },
                                             }}
                                             type="number" value={userData.peso || ''} onChange={handleInputChange('peso')}
                                             min={0} step={0.1} className="input-small"/>
                        </Box>
                    </InputsFieldset>
                </SectionCommon>

                <SectionCommon>
                    <h2 className="mainCommon title-2">Mundo Mental</h2>
                    <InputsFieldset>
                        <StyledTextField variant={"filled"} label={"Nome da Forma"} fullWidth
                                         type="text" value={userData.nomeF || ''}
                                         onChange={handleInputChange('nomeF')}/>
                        <StyledFormControl variant="filled" fullWidth>
                            <InputLabel>Categoria da Forma</InputLabel>
                            <Select
                                value={userData.forma || ''}
                                onChange={handleInputChange('forma')}
                            >
                                <MenuItem value="">Nenhum</MenuItem>
                                <MenuItem value={1}>Medo</MenuItem>
                                <MenuItem value={2}>Fobia</MenuItem>
                                <MenuItem value={3}>Trauma</MenuItem>
                            </Select>
                        </StyledFormControl>
                        <StyledTextField variant={"filled"} label={"Tipo da Forma"} fullWidth
                                         type="text" value={userData.tipoF || ''}
                                         onChange={handleInputChange('tipoF')}/>
                    </InputsFieldset>
                </SectionCommon>

                <SectionCommon>
                    <h2 className="mainCommon title-2">Recursos Vitais</h2>
                    <InputsFieldset>
                        <Box>
                            <StyledTextField variant="filled" label="Vida" fullWidth type="number"
                                             value={localLife()} min={0} disabled
                                             slotProps={{
                                                 input: {
                                                     startAdornment: (
                                                         <InputAdornment position="start">
                                                             <Favorite/>
                                                         </InputAdornment>
                                                     ),
                                                 },
                                             }}/>
                            <StyledTextField variant="filled" label="Vida Atual" fullWidth type="number"
                                             value={userData.vidaGasta || ''} onChange={handleInputChange('vidaGasta')}
                                             min={0}/>
                        </Box>
                        <Box>
                            <StyledTextField variant="filled" label="Estresse" fullWidth type="number"
                                             value={(((userData['pericia-Foco'] || 0) / 2) * 10)} min={0} disabled
                                             slotProps={{
                                                 input: {
                                                     startAdornment: (
                                                         <InputAdornment position="start">
                                                             <Psychology/>
                                                         </InputAdornment>
                                                     ),
                                                 },
                                             }}/>
                            <StyledTextField variant="filled" label="Estresse Atual" fullWidth type="number"
                                             value={userData.estresseGasto || ''}
                                             onChange={handleInputChange('estresseGasto')}
                                             min={0}/>
                        </Box>
                    </InputsFieldset>
                    <InputsFieldset>
                        <Box>
                            <StyledTextField variant="filled" label="Energia (NRG)" fullWidth type="number"
                                             value={localEnergy()} min={0} disabled
                                             slotProps={{
                                                 input: {
                                                     startAdornment: (
                                                         <InputAdornment position="start">
                                                             <FlashOn/>
                                                         </InputAdornment>
                                                     ),
                                                 },
                                             }}/>
                            <StyledTextField variant="filled" label="Energia Atual" fullWidth type="number"
                                             value={userData.energiaGasta || ''}
                                             onChange={handleInputChange('energiaGasta')}
                                             min={0}/>
                        </Box>
                        <Box>
                            <StyledTextField variant="filled" label="Sanidade" fullWidth type="number"
                                             value={(((userData['pericia-Foco'] || 0) / 2) * 10)} min={0} disabled
                                             slotProps={{
                                                 input: {
                                                     startAdornment: (
                                                         <InputAdornment position="start">
                                                             <Cyclone/>
                                                         </InputAdornment>
                                                     ),
                                                 },
                                             }}/>
                            <StyledTextField variant="filled" label="Sanidade Atual" fullWidth type="number"
                                             value={userData.sanidadeGasta || ''}
                                             onChange={handleInputChange('sanidadeGasta')}
                                             min={0}/>
                        </Box>
                    </InputsFieldset>
                </SectionCommon>

                <SectionCommon>
                    <h2 className="mainCommon title-2">Progressão e Potencial</h2>
                    <InputsFieldset>
                        <Box className={"flexBox"}>
                            <StyledTextField
                                variant="filled"
                                label="Defesa"
                                fullWidth
                                type="number"
                                value={15 + (userData['atributo-DES'] || 0) + (userData['atributo-DES-bonus'] || 0)}
                                min={0}
                                disabled
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Shield/>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <StyledTextField
                                variant="filled"
                                label="DT"
                                fullWidth
                                type="number"
                                value={10 + (userData['atributo-PRE'] || 0) + (userData['atributo-PRE-bonus'] || 0) + userData.nivel}
                                min={0}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Casino/>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                disabled
                            />
                            <StyledTextField
                                variant="filled"
                                label="Deslocamento"
                                fullWidth
                                type="number"
                                value={9}
                                min={0}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DirectionsRun/>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                disabled
                            />
                        </Box>
                    </InputsFieldset>
                    <InputsFieldset>
                        <Box className={"flexBox"}>
                            <StyledTextField
                                variant="filled"
                                label="Nível"
                                fullWidth
                                type="number"
                                value={userData.nivel || ''}
                                onChange={handleInputChange('nivel')}
                                min={0}
                            />
                            <StyledFormControl variant="filled" fullWidth>
                                <InputLabel>Afinidade</InputLabel>
                                <Select
                                    value={userData.afinidade || ''}
                                    onChange={handleInputChange('afinidade')}
                                >
                                    <MenuItem value=''>Nenhuma</MenuItem>
                                    <MenuItem value={1}>Aqua</MenuItem>
                                    <MenuItem value={2}>Axis</MenuItem>
                                    <MenuItem value={3}>Geo</MenuItem>
                                    <MenuItem value={4}>Khaos</MenuItem>
                                    <MenuItem value={5}>Lumen</MenuItem>
                                    <MenuItem value={6}>Pyro</MenuItem>
                                    <MenuItem value={7}>Volt</MenuItem>
                                    <MenuItem value={8}>Zephyr</MenuItem>
                                    <MenuItem value={9}>Tenebris</MenuItem>
                                </Select>
                            </StyledFormControl>
                        </Box>
                    </InputsFieldset>
                </SectionCommon>
            </StyledBoxField>
        </main>
    );
}