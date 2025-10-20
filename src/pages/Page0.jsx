import Background from './Page0/Background.jsx';
import HeroSection from './Page0/HeroSection.jsx';
import InfoSection from './Page0/InfoSection.jsx';

export default function Page0() {
    const handleGitHubButtonClick = () => {
        window.open("https://github.com/MarcosAlves90/projetoRPG_TMW_Ficha/tree/develop", "_blank");
    };

    const projectDescription = 
        'An online character sheet project for the virtual tabletop role-playing game "The Mental World". ' +
        'The project uses technologies such as HTML, CSS, JavaScript, React and Vite for its operation and stylization. ' +
        'The idea is for the user to be able to build their sheet on the platform and download it in JSON format for future use.';

    return (
        <>
            <Background />
            <main className="mainCommon page-0 root-style">
                <HeroSection 
                    title="MidNight"
                    subtitle='Clearance Nível ÔMEGA. Terminal de acesso classificado Sevastopol.'
                    category="The Mental World: Ano 1"
                />
                <InfoSection 
                    description={projectDescription}
                    buttonText="GitHub"
                    onButtonClick={handleGitHubButtonClick}
                />
            </main>
        </>
    );
}