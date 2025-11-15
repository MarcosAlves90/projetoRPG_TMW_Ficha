import { Section } from "@/assets/components/design-system";
import Skeleton from "@/assets/components/Skeleton.jsx";
import { Heart, Zap } from "lucide-react";

/**
 * Skeleton do componente VitalResourcesSection para carregamento
 * @returns {JSX.Element} Componente skeleton
 */
export default function SkeletonVitalResourcesSection() {
  return (
    <Section
      title="Recursos Vitais"
      subtitle="Gestão de vida, energia e sanidade mental"
      className="animate-fade-in"
    >
      <div className="md:space-y-6">
        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="card bg-white/5 border-white/10 p-4">
              <Skeleton variant="text" width="60%" height="14px" style={{ marginBottom: "12px" }} />
              <div style={{ marginBottom: "12px" }}>
                <Skeleton variant="text" width="40%" height="12px" style={{ marginBottom: "4px" }} />
                <Skeleton variant="text" width="70%" height="12px" />
              </div>
              <Skeleton variant="rectangular" width="100%" height="80px" />
            </div>
          ))}
        </div>

        <div className="divider max-md:hidden" />

        {/* Resource Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-md:hidden">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart size={14} className="text-red-400" />
              <Skeleton variant="text" width="100px" height="12px" />
            </div>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="text" width="80%" height="12px" style={{ marginTop: "4px" }} />
            ))}
          </div>

          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-yellow-400" />
              <Skeleton variant="text" width="100px" height="12px" />
            </div>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="text" width="85%" height="12px" style={{ marginTop: "4px" }} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
