import PropTypes from "prop-types";
import { Section, Input } from "@/assets/components/design-system";
import SkeletonMentalWorldSection from "./SkeletonMentalWorldSection.jsx";
import { Brain, AlertCircle, BookOpen } from "lucide-react";

export default function MentalWorldSection({
  userData,
  onInputChange,
  isLoading = false,
}) {
  if (isLoading) {
    return <SkeletonMentalWorldSection />;
  }

  const formaOptions = [
    { value: "", label: "Nenhum" },
    { value: 1, label: "🌀 Medo - Ansiedade irracional" },
    { value: 2, label: "😨 Fobia - Medo extremo" },
    { value: 3, label: "💔 Trauma - Ferida psicológica" },
  ];

  const selectedForma = formaOptions.find(
    (f) => f.value.toString() === userData.forma?.toString(),
  );

  return (
    <Section
      title="Mundo Mental"
      subtitle="Psicologia e aspectos imateriais"
      className="animate-fade-in"
    >
      <div className="space-y-6">
        {/* Main Form */}
        <div className="card bg-linear-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30 p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-300 shrink-0">
              <Brain size={18} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-purple-200 mb-1">
                Manifestação Mental
              </h3>
              <p className="text-xs text-gray-400">
                Define a forma que sua psique toma no mundo imaterial
              </p>
            </div>
          </div>

          <Input
            label="Nome da Forma"
            type="text"
            value={userData.nomeF || ""}
            onChange={onInputChange("nomeF")}
            placeholder="Ex: Sombra Dançante, Escudo de Luz..."
            className="input-focus mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <AlertCircle size={14} className="text-purple-400" />
                Categoria da Forma
              </label>
              <select
                value={userData.forma || ""}
                onChange={onInputChange("forma")}
                className="input-focus font-medium"
              >
                {formaOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Tipo/Variação"
              type="text"
              value={userData.tipoF || ""}
              onChange={onInputChange("tipoF")}
              placeholder="Ex: Agressiva, Defensiva..."
              className="input-focus"
            />
          </div>
        </div>

        <div className="divider" />

        {/* Current Manifestation Display */}
        {userData.nomeF && (
          <div className="card bg-white/5 border-white/10 p-4 animate-scale-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              <p className="text-xs font-semibold text-gray-400 uppercase">
                Forma Ativa
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-gray-400 mb-1">Nome</p>
                <p className="text-sm font-bold text-white">{userData.nomeF}</p>
              </div>
              {userData.forma && (
                <>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Categoria</p>
                    <p className="text-sm font-bold text-purple-300">
                      {selectedForma?.label.split(" - ")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tipo</p>
                    <p className="text-sm font-bold text-gray-200">
                      {userData.tipoF || "—"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-blue-400" />
              <p className="text-xs font-semibold text-gray-400">Categorias</p>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>
                • <span className="text-gray-300">Medo</span> - Ansiedade
                irracional
              </li>
              <li>
                • <span className="text-gray-300">Fobia</span> - Medo extremo
              </li>
              <li>
                • <span className="text-gray-300">Trauma</span> - Ferida
                psicológica
              </li>
            </ul>
          </div>

          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-purple-400" />
              <p className="text-xs font-semibold text-gray-400">Impacto</p>
            </div>
            <p className="text-xs text-gray-400">
              A forma mental afeta suas habilidades psiônicas e defesa
              emocional. Manifestações fortes podem influenciar o ambiente ao
              seu redor.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

MentalWorldSection.propTypes = {
  userData: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
