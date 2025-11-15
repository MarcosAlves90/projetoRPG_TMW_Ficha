import PropTypes from 'prop-types';
import {Box, InputAdornment, TextField} from "@mui/material";
import styles from './PersonalSection.module.css';

export default function PersonalSection({userData, onInputChange}) {
    return (
        <section className={styles.sectionCommon}>
            <h2 className={`mainCommon ${styles.title2}`}>Pessoal</h2>
            <fieldset className={styles.inputsFieldset}>
                <TextField
                    className={styles.styledTextField}
                    variant="filled"
                    label="Nome"
                    fullWidth
                    type="text"
                    value={userData.nome || ''}
                    onChange={onInputChange('nome')}
                />
                <TextField
                    className={styles.styledTextField}
                    variant="filled"
                    label="Data de Nascimento"
                    fullWidth
                    type="text"
                    value={userData.idade || ''}
                    onChange={onInputChange('idade')}
                />
                <TextField
                    className={styles.styledTextField}
                    variant="filled"
                    label="Profissão"
                    fullWidth
                    type="text"
                    value={userData.profissao || ''}
                    onChange={onInputChange('profissao')}
                />
            </fieldset>
            <fieldset className={styles.inputsFieldset}>
                <TextField
                    className={styles.styledTextField}
                    variant="filled"
                    label="Título"
                    fullWidth
                    type="text"
                    value={userData.titulo || ''}
                    onChange={onInputChange('titulo')}
                />
                <Box className={styles.flexBox}>
                    <TextField
                        className={styles.styledTextField}
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
                    />
                    <TextField
                        className={styles.styledTextField}
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
                    />
                </Box>
            </fieldset>
        </section>
    );
}

PersonalSection.propTypes = {
    userData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
