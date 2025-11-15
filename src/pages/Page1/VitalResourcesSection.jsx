import PropTypes from 'prop-types';
// MUI icons removed — using emoji / inline markers instead
import VitalResource from './VitalResource';
import styles from './VitalResourcesSection.module.css';

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
            icon: '❤️',
            currentKey: "vidaGasta",
            maxValue: localLife,
            color: "#e74c3c",
            lightColor: "#ff6b6b"
        },
        {
            label: "Estresse",
            icon: '🧠',
            currentKey: "estresseGasto",
            maxValue: (((userData['pericia-Foco'] || 0) / 2) * 10),
            color: "#9b59b6",
            lightColor: "#c39bd3"
        },
        {
            label: "Energia (NRG)",
            icon: '⚡',
            currentKey: "energiaGasta",
            maxValue: localEnergy,
            color: "#f39c12",
            lightColor: "#f8c471"
        },
        {
            label: "Sanidade",
            icon: '🌀',
            currentKey: "sanidadeGasta",
            maxValue: (((userData['pericia-Foco'] || 0) / 2) * 10),
            color: "#3498db",
            lightColor: "#5dade2"
        }
    ];

    return (
        <section className={styles.sectionCommon}>
            <h2 className={`mainCommon ${styles.title2}`}>Recursos Vitais</h2>
            <fieldset className={`${styles.inputsFieldset} ${styles.fullWidth}`}>
                <div className={styles.vitalResourcesGrid}>
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
                </div>
            </fieldset>
        </section>
    );
}

VitalResourcesSection.propTypes = {
    userData: PropTypes.object.isRequired,
    localLife: PropTypes.number.isRequired,
    localEnergy: PropTypes.number.isRequired,
    onResourceChange: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
