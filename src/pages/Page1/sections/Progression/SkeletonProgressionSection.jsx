import { Section } from "@/assets/components/design-system";
import Skeleton from "@/assets/components/Skeleton.jsx";
import { TrendingUp } from "lucide-react";

/**
 * Skeleton do componente ProgressionSection para carregamento
 * @returns {JSX.Element} Componente skeleton
 */
export default function SkeletonProgressionSection() {
  return (
    <Section
      title="Progressão e Potencial"
      subtitle="Métricas de desenvolvimento e combate"
      headerAction={
        <Skeleton variant="rectangular" width="120px" height="28px" />
      }
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card bg-white/5 border-white/10 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Skeleton variant="text" width="60px" height="12px" style={{ marginBottom: "8px" }} />
                  <Skeleton variant="text" width="40px" height="20px" />
                </div>
                <div className="w-6 h-6 bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* Level Control */}
        <div className="card bg-white/5 border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <Skeleton variant="text" width="120px" height="14px" style={{ marginBottom: "12px" }} />
              <Skeleton variant="text" width="100%" height="12px" style={{ marginBottom: "16px" }} />
              <div className="flex items-center gap-3">
                <Skeleton variant="rectangular" width="64px" height="64px" />
                <div className="flex-1">
                  <Skeleton variant="text" width="50px" height="12px" style={{ marginBottom: "4px" }} />
                  <Skeleton variant="text" width="80px" height="12px" />
                </div>
              </div>
            </div>

            <div>
              <Skeleton variant="text" width="80px" height="12px" style={{ marginBottom: "8px" }} />
              <Skeleton variant="rectangular" width="100%" height="36px" />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-lg p-4">
            <Skeleton variant="text" width="100px" height="12px" style={{ marginBottom: "12px" }} />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="text" width="85%" height="12px" style={{ marginTop: "4px" }} />
            ))}
          </div>

          <div className="glass rounded-lg p-4">
            <Skeleton variant="text" width="100px" height="12px" style={{ marginBottom: "12px" }} />
            <Skeleton variant="text" width="100%" height="12px" />
            <Skeleton variant="text" width="100%" height="12px" style={{ marginTop: "4px" }} />
          </div>
        </div>
      </div>
    </Section>
  );
}
