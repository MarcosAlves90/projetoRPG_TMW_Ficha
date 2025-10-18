import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Cyclone, Favorite, FlashOn, Psychology} from '@mui/icons-material';
import VitalResource from './VitalResource';

const VitalResourcesGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 100%;
    
    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 991px) {
        grid-template-columns: 1fr;
    }
`;

const InputsFieldset = styled.fieldset`
    margin: 1.5rem;
    display: flex;
    gap: 2rem;

    &.fullWidth {
        gap: 0;
        
        > * {
            width: 100%;
        }
    }

    @media (max-width: 991px) {
        flex-direction: column;
        margin: 1rem;
        gap: 1rem;
    }
`;

const SectionCommon = styled.section`
    width: 100%;
    margin-bottom: 1rem;

    .title-2 {
        width: 100%;
        margin: 0;
        color: white;
        background-color: var(--gray-border-color);
        padding: 0.1rem;
    }
`;

export default function VitalResourcesSection({
    userData,
    localLife,
    localEnergy,
    onResourceChange,
    onInputChange
}) {
    const vitalResources = [
        {
            label: "Vida",
            icon: Favorite,
            currentKey: "vidaGasta",
            maxValue: localLife,
            color: "#e74c3c",
            lightColor: "#ff6b6b"
        },
        {
            label: "Estresse",
            icon: Psychology,
            currentKey: "estresseGasto",
            maxValue: (((userData['pericia-Foco'] || 0) / 2) * 10),
            color: "#9b59b6",
            lightColor: "#c39bd3"
        },
        {
            label: "Energia (NRG)",
            icon: FlashOn,
            currentKey: "energiaGasta",
            maxValue: localEnergy,
            color: "#f39c12",
            lightColor: "#f8c471"
        },
        {
            label: "Sanidade",
            icon: Cyclone,
            currentKey: "sanidadeGasta",
            maxValue: (((userData['pericia-Foco'] || 0) / 2) * 10),
            color: "#3498db",
            lightColor: "#5dade2"
        }
    ];

    return (
        <SectionCommon>
            <h2 className="mainCommon title-2">Recursos Vitais</h2>
            <InputsFieldset className="fullWidth">
                <VitalResourcesGrid>
                    {vitalResources.map((resource) => (
                        <VitalResource
                            key={resource.currentKey}
                            label={resource.label}
                            icon={resource.icon}
                            currentKey={resource.currentKey}
                            currentValue={userData[resource.currentKey] || 0}
                            maxValue={resource.maxValue}
                            color={resource.color}
                            lightColor={resource.lightColor}
                            onResourceChange={onResourceChange}
                            onInputChange={onInputChange}
                        />
                    ))}
                </VitalResourcesGrid>
            </InputsFieldset>
        </SectionCommon>
    );
}

VitalResourcesSection.propTypes = {
    userData: PropTypes.object.isRequired,
    localLife: PropTypes.number.isRequired,
    localEnergy: PropTypes.number.isRequired,
    onResourceChange: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
