import PropTypes from "prop-types";
import { Section, Input } from "@/assets/components/design-system";
import SkeletonPersonalSection from "./SkeletonPersonalSection.jsx";
import { User, Briefcase, Ruler, Weight } from "lucide-react";

export default function PersonalSection({
  userData,
  onInputChange,
  isLoading = false,
}) {
  if (isLoading) {
    return <SkeletonPersonalSection />;
  }

  return (
    <Section
      title="Informações Pessoais"
      subtitle="Características físicas e profissionais"
      className="animate-fade-in"
    >
      <div className="space-y-6">
        {/* Primary Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-300">
                  <User size={16} />
                </div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Nome
                </label>
              </div>
              <Input
                type="text"
                value={userData.nome || ""}
                onChange={onInputChange("nome")}
                placeholder="Nome completo do personagem"
                className="input-focus"
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-purple-600/20 text-purple-300">
                  <Briefcase size={16} />
                </div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Profissão
                </label>
              </div>
              <Input
                type="text"
                value={userData.profissao || ""}
                onChange={onInputChange("profissao")}
                placeholder="Ex: Guerreiro, Mago, etc"
                className="input-focus"
              />
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Secondary Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Data de Nascimento"
            type="text"
            value={userData.idade || ""}
            onChange={onInputChange("idade")}
            placeholder="01/01/1990"
            className="input-focus"
          />

          <Input
            label="Título/Alcunha"
            type="text"
            value={userData.titulo || ""}
            onChange={onInputChange("titulo")}
            placeholder="Ex: O Destemido"
            className="input-focus"
          />
        </div>

        <div className="divider" />

        {/* Physical Attributes */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-600/20 text-cyan-300">
              <span className="text-xs">📏</span>
            </span>
            Características Físicas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card bg-white/5 border-white/10 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-cyan-600/20 text-cyan-300">
                  <Ruler size={16} />
                </div>
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Altura
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={userData.altura || ""}
                  onChange={onInputChange("altura")}
                  placeholder="1.80"
                  step={0.01}
                  min={0}
                  className="input-focus flex-1"
                />
                <span className="text-gray-400 font-medium">m</span>
              </div>
            </div>

            <div className="card bg-white/5 border-white/10 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-600/20 text-green-300">
                  <Weight size={16} />
                </div>
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Peso
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={userData.peso || ""}
                  onChange={onInputChange("peso")}
                  placeholder="80"
                  step={0.1}
                  min={0}
                  className="input-focus flex-1"
                />
                <span className="text-gray-400 font-medium">kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="glass rounded-lg p-4 mt-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            💡{" "}
            <span className="text-gray-300">
              As informações pessoais ajudam a definir a identidade única do seu
              personagem no mundo de Agamemnon.
            </span>
          </p>
        </div>
      </div>
    </Section>
  );
}

PersonalSection.propTypes = {
  userData: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
