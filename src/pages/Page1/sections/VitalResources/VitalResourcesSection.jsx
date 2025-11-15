import PropTypes from "prop-types";
import { Section } from "@/assets/components/design-system";
import VitalResource from "./VitalResource.jsx";
import { Heart, Zap, AlertTriangle } from "lucide-react";

export default function VitalResourcesSection({
  userData,
  localLife,
  localEnergy,
  onResourceChange,
  onInputChange,
}) {
  const vitalResources = [
    {
      label: "Vida",
      icon: "❤️",
      currentKey: "vidaGasta",
      maxValue: localLife,
      color: "#e74c3c",
      lightColor: "#ff6b6b",
    },
    {
      label: "Estresse",
      icon: "🧠",
      currentKey: "estresseGasto",
      maxValue: ((userData["pericia-Foco"] || 0) / 2) * 10,
      color: "#9b59b6",
      lightColor: "#c39bd3",
    },
    {
      label: "Energia (NRG)",
      icon: "⚡",
      currentKey: "energiaGasta",
      maxValue: localEnergy,
      color: "#f39c12",
      lightColor: "#f8c471",
    },
    {
      label: "Sanidade",
      icon: "🌀",
      currentKey: "sanidadeGasta",
      maxValue: ((userData["pericia-Foco"] || 0) / 2) * 10,
      color: "#3498db",
      lightColor: "#5dade2",
    },
  ];

  // Calculate alerts
  const criticalResources = vitalResources.filter((r) => {
    const current = userData[r.currentKey] || 0;
    const percentage = (current / r.maxValue) * 100;
    return percentage > 80;
  });

  return (
    <Section
      title="Recursos Vitais"
      subtitle="Gestão de vida, energia e sanidade mental"
      className="animate-fade-in"
    >
      <div className="md:space-y-6">
        {/* Critical Alert */}
        {criticalResources.length > 0 && (
          <div className="bg-red-600/10 border-l-4 border-red-500 rounded-lg p-4 animate-pulse shadow-lg">
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 rounded-lg bg-red-600/20 text-red-300 mt-0.5">
                <AlertTriangle size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-300 uppercase tracking-wide">
                  ⚠️ Recursos Críticos
                </p>
                <p className="text-sm text-red-200 mt-1">
                  {criticalResources.map((r) => r.label).join(", ")} em nível
                  crítico!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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

        <div className="divider max-md:hidden" />

        {/* Resource Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-md:hidden">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart size={14} className="text-red-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase">
                Vida e Vitalidade
              </p>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>
                • <span className="text-red-300">Vida</span>: Saúde física
              </li>
              <li>
                • <span className="text-purple-300">Estresse</span>: Fadiga
                mental
              </li>
              <li>• Recuperar em repouso</li>
            </ul>
          </div>

          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-yellow-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase">
                Energia e Mente
              </p>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>
                • <span className="text-yellow-300">Energia</span>: Força vital
              </li>
              <li>
                • <span className="text-blue-300">Sanidade</span>: Equilíbrio
                mental
              </li>
              <li>• Limite máximo determinado por atributos</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

VitalResourcesSection.propTypes = {
  userData: PropTypes.object.isRequired,
  localLife: PropTypes.number.isRequired,
  localEnergy: PropTypes.number.isRequired,
  onResourceChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};
