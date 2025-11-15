import PropTypes from "prop-types";
import ProfilePicUploader from "@/assets/components/ProfilePicUploader.jsx";
import SkeletonIdentitySection from "./SkeletonIdentitySection.jsx";
import styles from "./IdentitySection.module.css";

export default function IdentitySection({ userData, isLoading = false }) {
  if (isLoading) {
    return <SkeletonIdentitySection />;
  }

  return (
    <section className={styles.sectionIdentity}>
      <h3>IDENTIFICADOR</h3>
      <div className={styles.pBox}>
        <p>REGIÃO DE AGAMEMNON</p>
        <p>SECRETARIA DE SEGURANÇA PÚBLICA</p>
        <p>INSTITUTO DE IDENTIFICAÇÃO</p>
      </div>
      <div className={`${styles.picBox} d-flex`}>
        <div className={`${styles.profilePicImage} profile-pic-image`}>
          <ProfilePicUploader />
        </div>
        <div className={styles.textBox}>
          <p>
            <strong>Nome:</strong> {`${userData.nome || ""}`}
          </p>
          <p>
            <strong>Nascimento:</strong> {`${userData.idade || ""}`}
          </p>
          <p>
            <strong>Título:</strong> {`${userData.titulo || ""}`}
          </p>
          <p>
            <strong>Categoria:</strong> SSP-SEV
          </p>
        </div>
      </div>
    </section>
  );
}

IdentitySection.propTypes = {
  userData: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};
