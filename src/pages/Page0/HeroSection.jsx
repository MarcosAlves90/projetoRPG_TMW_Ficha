import PropTypes from 'prop-types';
import styles from './HeroSection.module.css';
import EnterButton from '../../assets/components/EnterButton';

export default function HeroSection({ title, category, subtitle }) {
    return (
        <section className="mainCommon-page-0-section-0">
            <article className="mainCommon-page-0-section-0-article">
                <div>
                    <h2 className={styles.category}>{category}</h2>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>
                        {subtitle}
                    </p>
                    <EnterButton/>
                </div>
            </article>
        </section>
    );
}

HeroSection.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
};
