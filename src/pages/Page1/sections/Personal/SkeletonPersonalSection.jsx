import Skeleton from "@/assets/components/Skeleton.jsx";
import styles from "./PersonalSection.module.css";

/**
 * Skeleton do componente PersonalSection para carregamento
 * @returns {JSX.Element} Componente skeleton
 */
export default function SkeletonPersonalSection() {
  return (
    <section className={`${styles.sectionCommon}`}>
      <h2 className={`mainCommon ${styles.title2}`}>Pessoal</h2>
      <fieldset className={styles.inputsFieldset}>
        <div className={styles.styledTextField}>
          <label>Nome</label>
          <Skeleton variant="rectangular" width="100%" height="36px" />
        </div>
        <div className={styles.styledTextField}>
          <label>Data de Nascimento</label>
          <Skeleton variant="rectangular" width="100%" height="36px" />
        </div>
        <div className={styles.styledTextField}>
          <label>Profissão</label>
          <Skeleton variant="rectangular" width="100%" height="36px" />
        </div>
      </fieldset>
      <fieldset className={styles.inputsFieldset}>
        <div className={styles.styledTextField}>
          <label>Título</label>
          <Skeleton variant="rectangular" width="100%" height="36px" />
        </div>
        <div className={styles.flexBox}>
          <div className={styles.styledTextField}>
            <label>Altura</label>
            <Skeleton variant="rectangular" width="100%" height="36px" />
          </div>
          <div className={styles.styledTextField}>
            <label>Peso</label>
            <Skeleton variant="rectangular" width="100%" height="36px" />
          </div>
        </div>
      </fieldset>
    </section>
  );
}
