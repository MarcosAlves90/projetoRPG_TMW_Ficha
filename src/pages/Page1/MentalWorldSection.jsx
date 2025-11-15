import PropTypes from 'prop-types';
import CustomInput from '../../assets/components/CustomInput.jsx';
import CustomSelect from '../../assets/components/CustomSelect.jsx';
import styles from './MentalWorldSection.module.css';

export default function MentalWorldSection({userData, onInputChange}) {
    return (
        <section className={styles.sectionCommon}>
            <h2 className={`mainCommon ${styles.title2}`}>Mundo Mental</h2>
            <fieldset className={styles.inputsFieldset}>
                <CustomInput
                    label="Nome da Forma"
                    type="text"
                    value={userData.nomeF || ''}
                    onChange={onInputChange('nomeF')}
                    placeholder="Ex: Aracnofobia"
                />
                <CustomSelect
                    label="Categoria da Forma"
                    value={userData.forma || ''}
                    onChange={onInputChange('forma')}
                    options={[
                        { value: '', label: 'Nenhum' },
                        { value: 1, label: 'Medo' },
                        { value: 2, label: 'Fobia' },
                        { value: 3, label: 'Trauma' },
                    ]}
                />
                <CustomInput
                    label="Tipo da Forma"
                    type="text"
                    value={userData.tipoF || ''}
                    onChange={onInputChange('tipoF')}
                    placeholder="Ex: Medo de aranhas"
                />
            </fieldset>
        </section>
    );
}

MentalWorldSection.propTypes = {
    userData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
