import { useEffect, useState } from 'react';

export default function Page0() {
    const [rotation, setRotation] = useState(0);

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
                        <div className={"mainCommon-page-0-logo"} style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.5s ease-out' }}>
                            <img src={"./images/tmwLogo.png"} alt={"The Mental World Logo"} />
                        </div>
                        <div className={"mainCommon-page-0-section-0-1 display-flex-center"}>
                            <div className={"mainCommon-page-0-titleHover"}>
                                <h1>The Mental World</h1>
                                <h2>Character Sheet Editor.</h2>
                            </div>
                        </div>
                    </article>
                </section>
                <section className={"mainCommon-page-0-section-1"}>
                    <p>An online character sheet project for the virtual tabletop role-playing game &quot;The Mental World&quot;. The project uses technologies such as HTML, CSS, JavaScript, React and Vite for its operation and stylization. The idea is for the user to be able to build their sheet on the platform and download it in JSON format for future use.</p>
                    <div className={"mainCommon-page-0-section-1-footer"}>
                        <button onClick={() => window.open("https://github.com/MarcosAlves90/projetoRPG_TMW_Ficha/tree/develop", "_blank")}>
                            GitHub
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
}