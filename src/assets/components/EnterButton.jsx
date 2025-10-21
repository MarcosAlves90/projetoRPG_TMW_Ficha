import { useNavigate } from 'react-router-dom';
import './EnterButton.css';

/**
 * Botão de entrada principal com efeitos visuais e sonoros
 * @returns {JSX.Element} Componente EnterButton
 */
export default function EnterButton() {
    const navigate = useNavigate();

    /**
     * Reproduz som de clique ao interagir com o botão
     */
    const playClickSound = () => {
        const audio = new Audio('/sounds/click-mainpage-button.mp3');
        audio.play().catch(error => {
            console.log('Erro ao reproduzir o som:', error);
        });
    };

    /**
     * Gerencia navegação e reprodução de som
     */
    const handleClick = () => {
        playClickSound();
        navigate('/individual');
    };

    return (
        <button
            onClick={handleClick}
            className="enter-button"
            style={{
                background: `
                    radial-gradient(circle, rgba(59, 130, 246, 0.36) 0%, rgba(0, 0, 0, 0) 95%),
                    linear-gradient(rgba(59, 130, 246, 0.073) 1px, transparent 1px),
                    linear-gradient(to right, rgba(59, 130, 246, 0.073) 1px, transparent 1px)
                `,
                backgroundSize: 'cover, 15px 15px, 15px 15px',
                backgroundPosition: 'center center, center center, center center',
                borderImage: 'radial-gradient(circle, rgb(59, 130, 246) 0%, rgba(0, 0, 0, 0) 100%) 1',
                filter: 'hue-rotate(0deg)'
            }}
            aria-label="Entrar na aplicação"
        >
            Entrar
        </button>
    );
}
