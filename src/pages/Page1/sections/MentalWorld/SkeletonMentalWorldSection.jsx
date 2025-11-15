import { Section } from "@/assets/components/design-system";
import Skeleton from "@/assets/components/Skeleton.jsx";
import { Brain, BookOpen } from "lucide-react";

/**
 * Skeleton do componente MentalWorldSection para carregamento
 * @returns {JSX.Element} Componente skeleton
 */
export default function SkeletonMentalWorldSection() {
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
              <Skeleton variant="text" width="120px" height="14px" style={{ marginBottom: "8px" }} />
              <Skeleton variant="text" width="100%" height="12px" />
            </div>
          </div>

          <div className="mb-4">
            <Skeleton variant="text" width="70px" height="12px" style={{ marginBottom: "8px" }} />
            <Skeleton variant="rectangular" width="100%" height="36px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton variant="text" width="100px" height="12px" />
              <Skeleton variant="rectangular" width="100%" height="36px" />
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton variant="text" width="80px" height="12px" />
              <Skeleton variant="rectangular" width="100%" height="36px" />
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-blue-400" />
              <Skeleton variant="text" width="70px" height="12px" />
            </div>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="text" width="90%" height="12px" style={{ marginTop: "4px" }} />
            ))}
          </div>

          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-purple-400" />
              <Skeleton variant="text" width="50px" height="12px" />
            </div>
            <Skeleton variant="text" width="100%" height="12px" />
            <Skeleton variant="text" width="100%" height="12px" style={{ marginTop: "4px" }} />
          </div>
        </div>
      </div>
    </Section>
  );
}
