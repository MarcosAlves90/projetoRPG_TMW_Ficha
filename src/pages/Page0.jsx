import { useEffect, useState } from 'react';
import PropTypes from "prop-types";

function LogoSection({ rotation }) {
    return (
        <div className={"mainCommon-page-0-logo"} style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.5s ease-out' }}>
            <img src={"./images/tmwLogo.png"} alt={"The Mental World Logo"} />
        </div>
    );
}

function TitleSection() {
    return (
        <div className={"mainCommon-page-0-section-0-1 display-flex-center"}>
            <div className={"mainCommon-page-0-titleHover"}>
                <h1>The Mental World</h1>
                <h2>Character Sheet Editor.</h2>
            </div>
        </div>
    );
}

function FooterSection({ handleGitHubButtonClick }) {
    return (
        <div className={"mainCommon-page-0-section-1-footer"}>
            <button onClick={handleGitHubButtonClick}>
                GitHub
            </button>
        </div>
    );
}

LogoSection.propTypes = {
    rotation: PropTypes.number.isRequired,
}

FooterSection.propTypes = {
    handleGitHubButtonClick: PropTypes.func.isRequired,
}

export default function Page0() {
    const [rotation, setRotation] = useState(0);

    function handleGitHubButtonClick() {
        window.open("https://github.com/MarcosAlves90/projetoRPG_TMW_Ficha/tree/develop", "_blank");
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const rotationDegree = scrollTop === -90 ? 90 : Math.min((scrollTop / (maxScroll / 2)) * 90, 90);
            setRotation(rotationDegree);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className={"backgroundCommon"} />
            <main className={"mainCommon page-0 root-style"}>
                <section className={"mainCommon-page-0-section-0"}>
                    <article className={"mainCommon-page-0-section-0-article"}>
                        <LogoSection rotation={rotation} />
                        <TitleSection />
                    </article>
                </section>
                <section className={"mainCommon-page-0-section-1"}>
                    <p>An online character sheet project for the virtual tabletop role-playing game &quot;The Mental World&quot;. The project uses technologies such as HTML, CSS, JavaScript, React and Vite for its operation and stylization. The idea is for the user to be able to build their sheet on the platform and download it in JSON format for future use.</p>
                    <FooterSection handleGitHubButtonClick={handleGitHubButtonClick} />
                </section>
            </main>
        </>
    );
}