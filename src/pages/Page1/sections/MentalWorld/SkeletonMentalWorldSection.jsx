import Skeleton from "@/assets/components/Skeleton.jsx";
import styles from "./MentalWorldSection.module.css";

/**
 * Skeleton do componente MentalWorldSection para carregamento
 * @returns {JSX.Element} Componente skeleton
 */
export default function SkeletonMentalWorldSection() {
  return (
    <section className={styles.sectionCommon}>
      <h2 className={`mainCommon ${styles.title2}`}>Mundo Mental</h2>
      <fieldset className={styles.inputsFieldset}>
        <div className={styles.styledTextField}>
          <label>Nome da Forma</label>
          <Skeleton variant="rectangular" width="100%" height="36px" />
        </div>
        <div className={styles.styledFormControl}>
          <label>Categoria da Forma</label>
          <Skeleton variant="rectangular" width="100%" height="36px" />
        </div>
        <div className={styles.styledTextField}>
          <label>Tipo da Forma</label>
          <Skeleton variant="rectangular" width="100%" height="36px" />
        </div>
      </fieldset>
    </section>
  );
}
