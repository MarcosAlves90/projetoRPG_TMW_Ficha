import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Box, InputAdornment, TextField} from "@mui/material";
import {DirectionsRun, Casino, Shield} from '@mui/icons-material';

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
    
    .flexBox {
        display: flex;
        gap: 2rem;
    }

    @media (max-width: 991px) {
        .title-2 {
            font-size: 4.5vw;
            padding: 0.8rem 0.5rem;
        }
        .flexBox {
            gap: 1rem;
        }
    }
`;

export default function ProgressionSection({userData, onInputChange}) {
    return (
        <SectionCommon>
            <h2 className="mainCommon title-2">Progressão e Potencial</h2>
            <InputsFieldset>
                <Box className="flexBox">
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
                <StyledTextField
                    variant="filled"
                    label="Nível"
                    fullWidth
                    type="number"
                    value={userData.nivel || ''}
                    onChange={onInputChange('nivel')}
                    min={0}
                />
            </InputsFieldset>
        </SectionCommon>
    );
}

ProgressionSection.propTypes = {
    userData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
