import { Section } from "@/assets/components/design-system";
import Skeleton from "@/assets/components/Skeleton.jsx";

/**
 * Skeleton do componente PersonalSection para carregamento
 * @returns {JSX.Element} Componente skeleton
 */
export default function SkeletonPersonalSection() {
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
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-600/20">
                <Skeleton variant="rectangular" width="16px" height="16px" />
              </div>
              <Skeleton variant="text" width="50px" height="12px" />
            </div>
            <Skeleton variant="rectangular" width="100%" height="36px" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-purple-600/20">
                <Skeleton variant="rectangular" width="16px" height="16px" />
              </div>
              <Skeleton variant="text" width="60px" height="12px" />
            </div>
            <Skeleton variant="rectangular" width="100%" height="36px" />
          </div>
        </div>

        <div className="divider" />

        {/* Secondary Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-orange-600/20">
                <Skeleton variant="rectangular" width="16px" height="16px" />
              </div>
              <Skeleton variant="text" width="100px" height="12px" />
            </div>
            <Skeleton variant="rectangular" width="100%" height="36px" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-rose-600/20">
                <Skeleton variant="rectangular" width="16px" height="16px" />
              </div>
              <Skeleton variant="text" width="60px" height="12px" />
            </div>
            <Skeleton variant="rectangular" width="100%" height="36px" />
          </div>
        </div>

        <div className="divider" />

        {/* Physical Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-cyan-600/20">
                <Skeleton variant="rectangular" width="16px" height="16px" />
              </div>
              <Skeleton variant="text" width="50px" height="12px" />
            </div>
            <Skeleton variant="rectangular" width="100%" height="36px" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-green-600/20">
                <Skeleton variant="rectangular" width="16px" height="16px" />
              </div>
              <Skeleton variant="text" width="40px" height="12px" />
            </div>
            <Skeleton variant="rectangular" width="100%" height="36px" />
          </div>
        </div>
      </div>
    </Section>
  );
}
