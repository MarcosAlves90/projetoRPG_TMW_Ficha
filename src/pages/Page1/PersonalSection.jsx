import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Box, InputAdornment, TextField} from "@mui/material";

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

const InputsFieldset = styled.fieldset`
    margin: 1.5rem;
    display: flex;
    gap: 2rem;

    .MuiBox-root {
        display: flex;
        width: 100%;
        gap: 0;
    }
    
    .flexBox {
        display: flex;
        gap: 2rem;
    }

    @media (max-width: 991px) {
        flex-direction: column;
        margin: 1rem;
        gap: 1rem;
        
        .flexBox {
            gap: 1rem;
        }
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
`;

export default function PersonalSection({userData, onInputChange}) {
    return (
        <SectionCommon>
            <h2 className="mainCommon title-2">Pessoal</h2>
            <InputsFieldset>
                <StyledTextField
                    variant="filled"
                    label="Nome"
                    fullWidth
                    type="text"
                    value={userData.nome || ''}
                    onChange={onInputChange('nome')}
                />
                <StyledTextField
                    variant="filled"
                    label="Data de Nascimento"
                    fullWidth
                    type="text"
                    value={userData.idade || ''}
                    onChange={onInputChange('idade')}
                    className="input-small"
                />
                <StyledTextField
                    variant="filled"
                    label="Profissão"
                    fullWidth
                    type="text"
                    className="input-small"
                    value={userData.profissao || ''}
                    onChange={onInputChange('profissao')}
                />
            </InputsFieldset>
            <InputsFieldset>
                <StyledTextField
                    variant="filled"
                    label="Título"
                    fullWidth
                    type="text"
                    value={userData.titulo || ''}
                    onChange={onInputChange('titulo')}
                />
                <Box className="flexBox">
                    <StyledTextField
                        variant="filled"
                        label="Altura"
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end">m</InputAdornment>,
                            },
                        }}
                        type="number"
                        value={userData.altura || ''}
                        onChange={onInputChange('altura')}
                        min={0}
                        step={0.01}
                        className="input-small"
                    />
                    <StyledTextField
                        variant="filled"
                        label="Peso"
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                            },
                        }}
                        type="number"
                        value={userData.peso || ''}
                        onChange={onInputChange('peso')}
                        min={0}
                        step={0.1}
                        className="input-small"
                    />
                </Box>
            </InputsFieldset>
        </SectionCommon>
    );
}

PersonalSection.propTypes = {
    userData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
