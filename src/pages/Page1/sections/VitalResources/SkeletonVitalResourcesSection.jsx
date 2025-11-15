import Skeleton from "@/assets/components/Skeleton.jsx";
import styles from "./VitalResourcesSection.module.css";

/**
 * Skeleton do componente VitalResourcesSection para carregamento
 * @returns {JSX.Element} Componente skeleton
 */
export default function SkeletonVitalResourcesSection() {
  return (
    <section className={styles.sectionCommon}>
      <h2 className={`mainCommon ${styles.title2}`}>Recursos Vitais</h2>
      <fieldset className={`${styles.inputsFieldset} ${styles.fullWidth}`}>
        <div className={styles.vitalResourcesGrid}>
          {[1, 2, 3, 4].map((index) => (
            <div key={index} style={{ padding: "16px" }}>
              <Skeleton
                variant="text"
                width="70%"
                height="16px"
                style={{ marginBottom: "12px" }}
              />
              <Skeleton variant="rectangular" width="100%" height="120px" />
            </div>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
