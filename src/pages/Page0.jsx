import { useEffect } from 'react';
import styled from 'styled-components';
import {Button} from "@mui/material";

const Title = styled.h1`
    font-family: 'Brevis', sans-serif;
    font-size: 5vw;
    
    @media (max-width: 991px) {
        font-size: 12vw;
    }
`;

const SubTitle = styled.h2`
    font-size: 1.5vw;
    
    @media (max-width: 991px) {
        font-size: 4vw;
    }
`;

const Background = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('images/page_0_background.gif');
    background-size: cover;
    background-position: center;
    z-index: -2;
    image-rendering: pixelated;
    filter: blur(5px);
    opacity: 0.5;
`;

const Section1 = styled.section`
    background-color: white;
    padding: 2rem;
    p {
        color: black;
        padding-bottom: 2rem;
        border-bottom: 1px solid black;
        margin-bottom: 2rem;
    }
    @media (max-width: 991px) {
        padding: 2rem 1rem;
    }
`;

const StyledButton = styled(Button)`
    width: 15vw;
    padding: 0.4rem;
    border-radius: 3px;
    font-weight: bold;
    font-size: 1rem;
    background-color: var(--background);
    color: white;
    font-family: var(--common-font-family), sans-serif !important;
    
    &:hover {
        background-color: var(--gray-border-color);
    }

    @media (max-width: 991px) {
        font-size: 4vw;
        width: 100%;
    }
`;

export default function Page0() {

    function handleGitHubButtonClick() {
        window.open("https://github.com/MarcosAlves90/projetoRPG_TMW_Ficha/tree/develop", "_blank");
    }

    useEffect(() => {
        const options = {
            animate: true,
            patternWidth: 100,
            patternHeight: 100,
            grainOpacity: 0.07,
            grainDensity: 0.8,
            grainWidth: 1,
            grainHeight: 1,
            grainChaos: 0.5,
            grainSpeed: 2
        };

        // eslint-disable-next-line no-undef
        grained('#grain-background', options);
    }, []);

    return (
        <>
            <div id={"grain-background"}></div>
            <Background/>
            <main className={"mainCommon page-0 root-style"}>
                <section className={"mainCommon-page-0-section-0"}>
                    <article className={"mainCommon-page-0-section-0-article"}>
                        <div>
                            <Title>MidNight</Title>
                            <SubTitle>Character Sheet Editor.</SubTitle>
                        </div>
                    </article>
                </section>
                <Section1>
                    <p className={"description"}>An online character sheet project for the virtual tabletop role-playing
                        game &quot;The Mental
                        World&quot;. The project uses technologies such as HTML, CSS, JavaScript, React and Vite for its
                        operation and stylization. The idea is for the user to be able to build their sheet on the
                        platform and download it in JSON format for future use.</p>
                    <StyledButton onClick={handleGitHubButtonClick}>
                        GitHub
                    </StyledButton>
                </Section1>
            </main>
        </>
    );
}