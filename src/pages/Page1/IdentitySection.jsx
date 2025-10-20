import PropTypes from 'prop-types';
import {Box} from "@mui/material";
import ProfilePicUploader from "../../assets/components/ProfilePicUploader.jsx";
import styles from './IdentitySection.module.css';

export default function IdentitySection({userData}) {
    return (
        <section className={styles.sectionIdentity}>
            <h3>IDENTIFICADOR</h3>
            <Box className={styles.pBox}>
                <p>REGIÃO DE AGAMEMNON</p>
                <p>SECRETARIA DE SEGURANÇA PÚBLICA</p>
                <p>INSTITUTO DE IDENTIFICAÇÃO</p>
            </Box>
            <Box className={`${styles.picBox} d-flex`}>
                <div className={`${styles.profilePicImage} profile-pic-image`}>
                    <ProfilePicUploader/>
                </div>
                <Box className={styles.textBox}>
                    <p><strong>Nome:</strong> {`${userData.nome || ''}`}</p>
                    <p><strong>Nascimento:</strong> {`${userData.idade || ''}`}</p>
                    <p><strong>Título:</strong> {`${userData.titulo || ''}`}</p>
                    <p><strong>Categoria:</strong> SSP-SEV</p>
                </Box>
            </Box>
        </section>
    );
}

IdentitySection.propTypes = {
    userData: PropTypes.object.isRequired,
};
