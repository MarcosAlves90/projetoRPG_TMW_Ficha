import Skeleton from '@/assets/components/Skeleton.jsx';
import styles from './ProgressionSection.module.css';

/**
 * Skeleton do componente ProgressionSection para carregamento
 * @returns {JSX.Element} Componente skeleton
 */
export default function SkeletonProgressionSection() {
    return (
        <section className={styles.sectionCommon}>
            <h2 className={`mainCommon ${styles.title2}`}>Progressão e Potencial</h2>
            <fieldset className={styles.inputsFieldset}>
                <div className={styles.flexBox}>
                    <div className={styles.styledTextField}>
                        <label>Defesa</label>
                        <Skeleton variant="rectangular" width="100%" height="36px" />
                    </div>
                    <div className={styles.styledTextField}>
                        <label>DT</label>
                        <Skeleton variant="rectangular" width="100%" height="36px" />
                    </div>
                    <div className={styles.styledTextField}>
                        <label>Deslocamento</label>
                        <Skeleton variant="rectangular" width="100%" height="36px" />
                    </div>
                </div>
            </fieldset>
            <fieldset className={styles.inputsFieldset}>
                <div className={styles.styledTextField}>
                    <label>Nível</label>
                    <Skeleton variant="rectangular" width="100%" height="36px" />
                </div>
            </fieldset>
        </section>
    );
}
