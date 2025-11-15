import Skeleton from "@/assets/components/Skeleton.jsx";
import styles from "./IdentitySection.module.css";

/**
 * Skeleton do componente IdentitySection para carregamento
 * @returns {JSX.Element} Componente skeleton
 */
export default function SkeletonIdentitySection() {
  return (
    <section className={styles.sectionIdentity}>
      <h3>IDENTIFICADOR</h3>
      <div className={styles.pBox}>
        <Skeleton variant="text" width="80%" height="16px" />
        <Skeleton
          variant="text"
          width="85%"
          height="16px"
          style={{ marginTop: "8px" }}
        />
        <Skeleton
          variant="text"
          width="75%"
          height="16px"
          style={{ marginTop: "8px" }}
        />
      </div>
      <div className={`${styles.picBox} d-flex`}>
        <div className={`${styles.profilePicImage} profile-pic-image`}>
          <Skeleton variant="circular" width="150px" height="150px" />
        </div>
        <div className={styles.textBox}>
          <div style={{ marginBottom: "12px" }}>
            <Skeleton variant="text" width="60%" height="14px" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <Skeleton variant="text" width="70%" height="14px" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <Skeleton variant="text" width="65%" height="14px" />
          </div>
          <div>
            <Skeleton variant="text" width="50%" height="14px" />
          </div>
        </div>
      </div>
    </section>
  );
}
