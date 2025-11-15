import PropTypes from 'prop-types';
import {Box} from "@mui/material";
import {DirectionsRun, Casino, Shield} from '@mui/icons-material';
import CustomInput from '../../assets/components/CustomInput.jsx';
import styles from './ProgressionSection.module.css';

export default function ProgressionSection({userData, onInputChange}) {
    return (
        <section className={styles.sectionCommon}>
            <h2 className={`mainCommon ${styles.title2}`}>Progressão e Potencial</h2>
            <fieldset className={styles.inputsFieldset}>
                <Box className={styles.flexBox}>
                    <CustomInput
                        label="Defesa"
                        type="number"
                        value={15 + (userData['atributo-DES'] || 0) + (userData['atributo-DES-bonus'] || 0)}
                        disabled
                        startAdornment={<Shield />}
                    />
                    <CustomInput
                        label="DT"
                        type="number"
                        value={10 + (userData['atributo-PRE'] || 0) + (userData['atributo-PRE-bonus'] || 0) + userData.nivel}
                        disabled
                        startAdornment={<Casino />}
                    />
                    <CustomInput
                        label="Deslocamento"
                        type="number"
                        value={9}
                        disabled
                        startAdornment={<DirectionsRun />}
                    />
                </Box>
            </fieldset>
            <fieldset className={styles.inputsFieldset}>
                <CustomInput
                    label="Nível"
                    type="number"
                    value={userData.nivel || ''}
                    onChange={onInputChange('nivel')}
                    min={0}
                    placeholder="Ex: 1"
                />
            </fieldset>
        </section>
    );
}

ProgressionSection.propTypes = {
    userData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
