import PropTypes from 'prop-types';
import {Box, InputAdornment, TextField} from "@mui/material";
import {DirectionsRun, Casino, Shield} from '@mui/icons-material';
import styles from './ProgressionSection.module.css';

export default function ProgressionSection({userData, onInputChange}) {
    return (
        <section className={styles.sectionCommon}>
            <h2 className={`mainCommon ${styles.title2}`}>Progressão e Potencial</h2>
            <fieldset className={styles.inputsFieldset}>
                <Box className={styles.flexBox}>
                    <TextField
                        className={styles.styledTextField}
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
                    <TextField
                        className={styles.styledTextField}
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
                    <TextField
                        className={styles.styledTextField}
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
            </fieldset>
            <fieldset className={styles.inputsFieldset}>
                <TextField
                    className={styles.styledTextField}
                    variant="filled"
                    label="Nível"
                    fullWidth
                    type="number"
                    value={userData.nivel || ''}
                    onChange={onInputChange('nivel')}
                    min={0}
                />
            </fieldset>
        </section>
    );
}

ProgressionSection.propTypes = {
    userData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
