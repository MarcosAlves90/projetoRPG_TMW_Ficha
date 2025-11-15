import PropTypes from "prop-types";
import { Section, Badge } from "@/assets/components/design-system";
import ProfilePicUploader from "@/assets/components/ProfilePicUploader.jsx";
import SkeletonIdentitySection from "./SkeletonIdentitySection.jsx";
import { User, Calendar, Award, Shield, Sparkles } from "lucide-react";

export default function IdentitySection({ userData, isLoading = false }) {
  if (isLoading) {
    return <SkeletonIdentitySection />;
  }

  return (
    <Section
      title="Identificador Oficial"
      subtitle="Secretaria de Segurança Pública - Instituto de Identificação"
      className="max-w-5xl mx-auto mb-6 animate-fade-in"
    >
      {/* Official Header */}
      <div className="glass rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center gap-3 text-gray-400 text-xs font-bold tracking-widest">
          <Shield size={14} className="text-blue-400" />
          <span>REGIÃO DE AGAMEMNON</span>
          <span className="text-gray-600">•</span>
          <span>SECRETARIA DE SEGURANÇA PÚBLICA</span>
          <span className="text-gray-600">•</span>
          <span>INSTITUTO DE IDENTIFICAÇÃO</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Profile Picture with Border Effect */}
        <div className="lg:col-span-1 flex-center">
          <div className="relative group w-fit">
            {/* Glow effect background */}
            <div className="absolute -inset-2 bg-linear-to-br from-blue-600/40 via-purple-600/40 to-cyan-600/40 rounded-lg blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" style={{ aspectRatio: "1" }} />

            {/* Profile frame */}
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-blue-500/50 bg-[#171d2e] shadow-2xl hover-lift">
              <ProfilePicUploader />
            </div>

            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-blue-500 rounded-tl" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-tr" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-blue-500 rounded-bl" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-blue-500 rounded-br" />
          </div>
        </div>

        {/* Identity Information */}
        <div className="lg:col-span-3 space-y-4">
          {/* Nome Principal */}
          <div className="card bg-linear-to-r from-blue-600/10 to-purple-600/10 border-blue-500/40 p-4 hover-lift">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-600/30 text-blue-300 shrink-0 mt-1">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-widest">
                  Nome Completo
                </p>
                <p className="text-2xl font-bold text-white truncate hover:text-blue-300 transition-colors">
                  {userData.nome || "[ PENDENTE ]"}
                </p>
              </div>
              {userData.nome && (
                <div className="p-2 text-yellow-400">
                  <Sparkles size={18} />
                </div>
              )}
            </div>
          </div>

          {/* Informações Secundárias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nascimento */}
            <div className="card bg-white/5 border-white/10 hover-lift p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-green-600/20 text-green-300">
                  <Calendar size={16} />
                </div>
                <p className="text-xs text-gray-400 font-semibold uppercase">
                  Nascimento
                </p>
              </div>
              <p className="text-sm font-medium text-gray-200 truncate">
                {userData.idade || "[ Não informado ]"}
              </p>
            </div>

            {/* Título */}
            <div className="card bg-white/5 border-white/10 hover-lift p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-300">
                  <Award size={16} />
                </div>
                <p className="text-xs text-gray-400 font-semibold uppercase">
                  Título
                </p>
              </div>
              <p className="text-sm font-medium text-gray-200 truncate">
                {userData.titulo || "[ Sem título ]"}
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-semibold uppercase">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">
                <Shield size={12} />
                SSP-SEV
              </Badge>
              {userData.profissao && (
                <Badge variant="secondary">💼 {userData.profissao}</Badge>
              )}
              {userData.nivel > 0 && (
                <Badge variant="success">⭐ Nível {userData.nivel}</Badge>
              )}
              {userData.nome && <Badge variant="success">✓ Cadastrado</Badge>}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

IdentitySection.propTypes = {
  userData: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};
