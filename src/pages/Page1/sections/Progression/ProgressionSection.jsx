import PropTypes from 'prop-types';
import SkeletonProgressionSection from './SkeletonProgressionSection.jsx';
import styles from './ProgressionSection.module.css';

export default function ProgressionSection({userData, onInputChange, isLoading = false}) {
    if (isLoading) {
        return <SkeletonProgressionSection />;
    }
    
    return (
        <section className={styles.sectionCommon}>
            <h2 className={`mainCommon ${styles.title2}`}>Progressão e Potencial</h2>
            <fieldset className={styles.inputsFieldset}>
                <div className={styles.flexBox}>
                    <div className={styles.styledTextField}>
                        <label>Defesa</label>
                        <div className={styles.inputWithAdornment}>
                            <input
                                type="number"
                                value={15 + (userData['atributo-DES'] || 0) + (userData['atributo-DES-bonus'] || 0)}
                                min={0}
                                disabled
                            />
                            <span className={styles.inputAdornment}>🛡️</span>
                        </div>
                    </div>
                    <div className={styles.styledTextField}>
                        <label>DT</label>
                        <div className={styles.inputWithAdornment}>
                            <input
                                type="number"
                                value={10 + (userData['atributo-PRE'] || 0) + (userData['atributo-PRE-bonus'] || 0) + userData.nivel}
                                min={0}
                                disabled
                            />
                            <span className={styles.inputAdornment}>🎲</span>
                        </div>
                    </div>
                    <div className={styles.styledTextField}>
                        <label>Deslocamento</label>
                        <div className={styles.inputWithAdornment}>
                            <input
                                type="number"
                                value={9}
                                min={0}
                                disabled
                            />
                            <span className={styles.inputAdornment}>🏃</span>
                        </div>
                    </div>
                </div>
            </fieldset>
            <fieldset className={styles.inputsFieldset}>
                <div className={styles.styledTextField}>
                    <label>Nível</label>
                    <input
                        type="number"
                        value={userData.nivel || ''}
                        onChange={onInputChange('nivel')}
                        min={0}
                    />
                </div>
            </fieldset>
        </section>
    );
}

ProgressionSection.propTypes = {
    userData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};
