import PropTypes from "prop-types";
import {
  Section,
  Input,
  Badge,
  StatCard,
} from "@/assets/components/design-system";
import SkeletonProgressionSection from "./SkeletonProgressionSection.jsx";
import { Shield, Zap, TrendingUp } from "lucide-react";

export default function ProgressionSection({
  userData,
  onInputChange,
  isLoading = false,
}) {
  if (isLoading) {
    return <SkeletonProgressionSection />;
  }

  const defesa =
    15 +
    (userData["atributo-DES"] || 0) +
    (userData["atributo-DES-bonus"] || 0);
  const dt =
    10 +
    (userData["atributo-PRE"] || 0) +
    (userData["atributo-PRE-bonus"] || 0) +
    (userData.nivel || 0);
  const deslocamento = 9;

  return (
    <Section
      title="Progressão e Potencial"
      subtitle="Métricas de desenvolvimento e combate"
      headerAction={
        <Badge variant="success">
          <TrendingUp size={12} />
          Nível {userData.nivel || 0}
        </Badge>
      }
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Defesa"
            value={defesa}
            icon={<Shield size={24} />}
            color="blue"
          />

          <StatCard
            label="DT (Dificuldade)"
            value={dt}
            icon="🎲"
            color="purple"
          />

          <StatCard
            label="Deslocamento"
            value={`${deslocamento}m`}
            icon={<Zap size={24} />}
            color="cyan"
          />
        </div>

        <div className="divider" />

        {/* Level Control */}
        <div className="card bg-white/5 border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                Controle de Nível
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                O nível afeta diretamente seus atributos, DT e recursos vitais.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-center w-16 h-16 rounded-lg bg-blue-600/20 border border-blue-500/30">
                  <span className="text-2xl font-bold text-blue-300">
                    {userData.nivel || 0}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Nível Atual</p>
                  <p className="text-sm text-gray-300">
                    {userData.nivel > 0 ? `Experiência acumulada` : "Iniciante"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Input
                label="Ajustar Nível"
                type="number"
                value={userData.nivel || ""}
                onChange={onInputChange("nivel")}
                placeholder="0"
                min={0}
                max={99}
              />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-lg p-4">
            <p className="text-xs text-gray-400 font-semibold mb-2 uppercase">
              📊 Bônus por Atributos
            </p>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Defesa = 15 + DES + Bônus DES</li>
              <li>• DT = 10 + PRE + Bônus PRE + Nível</li>
            </ul>
          </div>

          <div className="glass rounded-lg p-4">
            <p className="text-xs text-gray-400 font-semibold mb-2 uppercase">
              ⚡ Deslocamento Base
            </p>
            <p className="text-xs text-gray-300">
              Distância que você pode percorrer em um turno de combate (padrão:
              9m)
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

ProgressionSection.propTypes = {
  userData: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
