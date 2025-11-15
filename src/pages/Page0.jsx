import Background from './Page0/Background.jsx';
import HeroSection from './Page0/HeroSection.jsx';

export default function Page0() {
    return (
        <>
            <Background />
            <main className="mainCommon page-0 root-style">
                <HeroSection 
                    category="THE MENTAL WORLD: ANO 1"
                    title="MidNight"
                    subtitle='Clearance Nível ÔMEGA. Terminal de acesso classificado Sevastopol.'
                />
            </main>
        </>
    );
}