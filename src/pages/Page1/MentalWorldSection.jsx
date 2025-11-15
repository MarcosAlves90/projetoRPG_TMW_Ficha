import PropTypes from 'prop-types';
import {TextField, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import styles from './MentalWorldSection.module.css';

export default function MentalWorldSection({userData, onInputChange}) {
    return (
        <section className={styles.sectionCommon}>
            <h2 className={`mainCommon ${styles.title2}`}>Mundo Mental</h2>
            <fieldset className={styles.inputsFieldset}>
                <TextField
                    className={styles.styledTextField}
                    variant="filled"
                    label="Nome da Forma"
                    fullWidth
                    type="text"
                    value={userData.nomeF || ''}
                    onChange={onInputChange('nomeF')}
                />
                <FormControl className={styles.styledFormControl} variant="filled" fullWidth>
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
                </FormControl>
                <TextField
                    className={styles.styledTextField}
                    variant="filled"
                    label="Tipo da Forma"
                    fullWidth
                    type="text"
                    value={userData.tipoF || ''}
                    onChange={onInputChange('tipoF')}
                />
            </fieldset>
        </section>
    );
}

MentalWorldSection.propTypes = {
    userData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
