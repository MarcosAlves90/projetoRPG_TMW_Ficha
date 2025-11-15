import PropTypes from "prop-types";
import { useLayout } from "@/assets/components/LayoutContext.jsx";
import SkeletonPersonalSection from "./SkeletonPersonalSection.jsx";
import styles from "./PersonalSection.module.css";

export default function PersonalSection({
  userData,
  onInputChange,
  isLoading = false,
}) {
  const { isCollapsed } = useLayout() || { isCollapsed: false };

  if (isLoading) {
    return <SkeletonPersonalSection />;
  }

  return (
    <section
      className={`${styles.sectionCommon} ${isCollapsed ? styles.compact : ""}`}
    >
      <h2 className={`mainCommon ${styles.title2}`}>Pessoal</h2>
      <fieldset className={styles.inputsFieldset}>
        <div className={styles.styledTextField}>
          <label>Nome</label>
          <input
            type="text"
            value={userData.nome || ""}
            onChange={onInputChange("nome")}
          />
        </div>
        <div className={styles.styledTextField}>
          <label>Data de Nascimento</label>
          <input
            type="text"
            value={userData.idade || ""}
            onChange={onInputChange("idade")}
          />
        </div>
        <div className={styles.styledTextField}>
          <label>Profissão</label>
          <input
            type="text"
            value={userData.profissao || ""}
            onChange={onInputChange("profissao")}
          />
        </div>
      </fieldset>
      <fieldset className={styles.inputsFieldset}>
        <div className={styles.styledTextField}>
          <label>Título</label>
          <input
            type="text"
            value={userData.titulo || ""}
            onChange={onInputChange("titulo")}
          />
        </div>
        <div className={styles.flexBox}>
          <div className={styles.styledTextField}>
            <label>Altura</label>
            <div className={styles.inputWithAdornment}>
              <input
                type="number"
                value={userData.altura || ""}
                onChange={onInputChange("altura")}
                min={0}
                step={0.01}
              />
              <span className={styles.inputAdornment}>m</span>
            </div>
          </div>
          <div className={styles.styledTextField}>
            <label>Peso</label>
            <div className={styles.inputWithAdornment}>
              <input
                type="number"
                value={userData.peso || ""}
                onChange={onInputChange("peso")}
                min={0}
                step={0.1}
              />
              <span className={styles.inputAdornment}>kg</span>
            </div>
          </div>
        </div>
      </fieldset>
    </section>
  );
}

PersonalSection.propTypes = {
  userData: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
