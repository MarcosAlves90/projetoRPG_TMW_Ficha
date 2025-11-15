import PropTypes from 'prop-types';
import styles from './Skeleton.module.css';

/**
 * Componente Skeleton para mostrar placeholder durante carregamento
 * @param {Object} props - Propriedades do skeleton
 * @param {string} [props.variant='text'] - Tipo de skeleton: 'text', 'circular', 'rectangular'
 * @param {number} [props.width='100%'] - Largura do skeleton
 * @param {number} [props.height] - Altura do skeleton
 * @param {number} [props.count=1] - Quantidade de linhas de texto
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element} Componente Skeleton
 */
export default function Skeleton({ 
    variant = 'text', 
    width = '100%', 
    height, 
    count = 1,
    className = ''
}) {
    const skeletonHeight = height || (variant === 'text' ? '12px' : '40px');
    
    if (variant === 'circular') {
        return (
            <div 
                className={`${styles.skeleton} ${styles.circular} ${className}`}
                style={{
                    width: width,
                    height: width,
                }}
            />
        );
    }

    if (count > 1 && variant === 'text') {
        return (
            <div className={className}>
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.skeleton} ${styles.text}`}
                        style={{
                            width: index === count - 1 ? '80%' : width,
                            height: skeletonHeight,
                            marginBottom: index < count - 1 ? '8px' : '0',
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${styles.skeleton} ${styles[variant]} ${className}`}
            style={{
                width,
                height: skeletonHeight,
            }}
        />
    );
}

Skeleton.propTypes = {
    variant: PropTypes.oneOf(['text', 'circular', 'rectangular']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count: PropTypes.number,
    className: PropTypes.string,
};
