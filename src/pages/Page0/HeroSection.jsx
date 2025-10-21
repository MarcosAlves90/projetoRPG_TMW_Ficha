import PropTypes from 'prop-types';
import EnterButton from '../../assets/components/EnterButton';

export default function HeroSection({ title, category, subtitle }) {
    return (
        <section className='flex flex-col items-center'>
            <h2 className="text-2xl font-bold mb-4 font-futura">{category}</h2>
            <h1 className="text-6xl sm:text-8xl font-brevis mb-1">{title}</h1>
            <p className="text-sm sm:text-base mb-10 max-sm:max-w-89">
                {subtitle}
            </p>
            <EnterButton/>
        </section>
    );
}

HeroSection.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
};
