import PropTypes from 'prop-types';
import {Button} from "@mui/material";
import styles from './InfoSection.module.css';

export default function InfoSection({description, buttonText, onButtonClick}) {
    return (
        <section className={styles.infoSection}>
            <p className={styles.description}>{description}</p>
            <Button 
                className={styles.styledButton}
                onClick={onButtonClick}
            >
                {buttonText}
            </Button>
        </section>
    );
}

InfoSection.propTypes = {
    description: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    onButtonClick: PropTypes.func.isRequired,
};
