import PropTypes from 'prop-types';
import styled from 'styled-components';
import {TextField, Select, MenuItem, FormControl, InputLabel} from "@mui/material";

const StyledTextField = styled(TextField)`
    margin-top: 0;

    .MuiInputLabel-root, .MuiInputBase-input {
        font-family: var(--common-font-family), sans-serif !important;
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
        padding: 0.5rem;
        font-size: 1.2rem;
    }
    
    @media (max-width: 991px) {
        .title-2 {
            font-size: 4.5vw;
            padding: 0.8rem 0.5rem;
        }
    }
`;

export default function MentalWorldSection({userData, onInputChange}) {
    return (
        <SectionCommon>
            <h2 className="mainCommon title-2">Mundo Mental</h2>
            <InputsFieldset>
                <StyledTextField
                    variant="filled"
                    label="Nome da Forma"
                    fullWidth
                    type="text"
                    value={userData.nomeF || ''}
                    onChange={onInputChange('nomeF')}
                />
                <StyledFormControl variant="filled" fullWidth>
                    <InputLabel>Categoria da Forma</InputLabel>
                    <Select
                        value={userData.forma || ''}
                        onChange={onInputChange('forma')}
                    >
                        <MenuItem value="">Nenhum</MenuItem>
                        <MenuItem value={1}>Medo</MenuItem>
                        <MenuItem value={2}>Fobia</MenuItem>
                        <MenuItem value={3}>Trauma</MenuItem>
                    </Select>
                </StyledFormControl>
                <StyledTextField
                    variant="filled"
                    label="Tipo da Forma"
                    fullWidth
                    type="text"
                    value={userData.tipoF || ''}
                    onChange={onInputChange('tipoF')}
                />
            </InputsFieldset>
        </SectionCommon>
    );
}

MentalWorldSection.propTypes = {
    userData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
