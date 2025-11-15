import PropTypes from 'prop-types';
// MUI removed — using native inputs and select
import styles from './MentalWorldSection.module.css';

export default function MentalWorldSection({userData, onInputChange}) {
    return (
        <section className={styles.sectionCommon}>
            <h2 className={`mainCommon ${styles.title2}`}>Mundo Mental</h2>
            <fieldset className={styles.inputsFieldset}>
                <div className={styles.styledTextField}>
                    <label>Nome da Forma</label>
                    <input type="text" value={userData.nomeF || ''} onChange={onInputChange('nomeF')} />
                </div>
                <div className={styles.styledFormControl}>
                    <label>Categoria da Forma</label>
                    <select value={userData.forma || ''} onChange={onInputChange('forma')}>
                        <option value="">Nenhum</option>
                        <option value={1}>Medo</option>
                        <option value={2}>Fobia</option>
                        <option value={3}>Trauma</option>
                    </select>
                </div>
                <div className={styles.styledTextField}>
                    <label>Tipo da Forma</label>
                    <input type="text" value={userData.tipoF || ''} onChange={onInputChange('tipoF')} />
                </div>
            </fieldset>
        </section>
    );
}

MentalWorldSection.propTypes = {
    userData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
