import { Section } from "@/assets/components/design-system";
import Skeleton from "@/assets/components/Skeleton.jsx";
import { Shield } from "lucide-react";

/**
 * Skeleton do componente IdentitySection para carregamento
 * @returns {JSX.Element} Componente skeleton
 */
export default function SkeletonIdentitySection() {
  return (
    <Section
      title="Identificador Oficial"
      subtitle="Secretaria de Segurança Pública - Instituto de Identificação"
      className="max-w-5xl mx-auto mb-6 animate-fade-in"
    >
      {/* Official Header */}
      <div className="glass rounded-lg p-4 mb-6 max-md:hidden">
        <div className="flex items-center justify-center gap-3 text-gray-400 text-xs font-bold tracking-widest">
          <Shield size={14} className="text-blue-400" />
          <Skeleton variant="text" width="150px" height="12px" />
          <span className="text-gray-600">•</span>
          <Skeleton variant="text" width="180px" height="12px" />
          <span className="text-gray-600">•</span>
          <Skeleton variant="text" width="160px" height="12px" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Profile Picture */}
        <div className="lg:col-span-1 flex-center">
          <div className="relative group w-fit">
            <div
              className="absolute -inset-2 bg-linear-to-br from-blue-600/40 via-purple-600/40 to-cyan-600/40 rounded-lg blur-xl opacity-60"
              style={{ aspectRatio: "1" }}
            />
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-blue-500/50 bg-[#171d2e] shadow-2xl">
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </div>
          </div>
        </div>

        {/* Identity Information */}
        <div className="lg:col-span-3 space-y-4">
          {/* Nome Principal */}
          <div className="card bg-linear-to-r from-blue-600/10 to-purple-600/10 border-blue-500/40 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-600/30 text-blue-300 shrink-0 mt-1">
                <Skeleton variant="rectangular" width="20px" height="20px" />
              </div>
              <div className="flex-1 min-w-0">
                <Skeleton variant="text" width="40%" height="12px" style={{ marginBottom: "8px" }} />
                <Skeleton variant="text" width="70%" height="24px" />
              </div>
            </div>
          </div>

          {/* Informações Secundárias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="card bg-white/5 border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-green-600/20">
                  <Skeleton variant="rectangular" width="16px" height="16px" />
                </div>
                <Skeleton variant="text" width="60px" height="12px" />
              </div>
              <Skeleton variant="text" width="80%" height="14px" />
            </div>

            <div className="card bg-white/5 border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-purple-600/20">
                  <Skeleton variant="rectangular" width="16px" height="16px" />
                </div>
                <Skeleton variant="text" width="40px" height="12px" />
              </div>
              <Skeleton variant="text" width="70%" height="14px" />
            </div>
          </div>

          {/* Status Badges */}
          <div className="space-y-2">
            <Skeleton variant="text" width="50px" height="12px" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" width="80px" height="28px" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
