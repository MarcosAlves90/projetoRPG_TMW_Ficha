import { useCallback, useContext } from "react";
import { UserContext } from "../UserContext.jsx";
import { usePageUnmount } from "@/hooks/usePageUnmount.js";
import { useAutoSave } from "@/hooks/useAutoSave.js";
import { AutoSaveIndicator } from "@/assets/components/AutoSaveIndicator.jsx";
import {
  IdentitySection,
  PersonalSection,
  MentalWorldSection,
  VitalResourcesSection,
  ProgressionSection,
} from "@/pages/Page1/sections/index.js";

export default function Page1() {
  const { userData, setUserData } = useContext(UserContext);

  // Garante sincronização ao sair da página
  usePageUnmount();

  // Salvamento automático com debounce de 2s
  const autoSaveState = useAutoSave(userData, 2000);

  const handleInputChange = (key) => (event) => {
    const { value, type } = event.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [key]:
        type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const localEnergy = useCallback(() => {
    const pre = userData["atributo-PRE"] || 0;
    const bioEnergy = userData["biotipo-Energia"] || 0;
    const energyMap = { 1: 2, 2: 3, 3: 4 };
    return (energyMap[bioEnergy] + pre) * userData.nivel || 0;
  }, [userData]);

  const localLife = useCallback(() => {
    const vig = userData["atributo-VIG"] || 0;
    const bioLife = userData["biotipo-Vida"] || 0;
    const lifeMap = { 1: 12, 2: 16, 3: 20 };
    return (
      lifeMap[bioLife] +
        vig +
        (userData.nivel - 1) * (lifeMap[bioLife] / 4 + vig) || 0
    );
  }, [userData]);

  const handleResourceChange = (resourceKey, maxValue, increment) => {
    setUserData((prevUserData) => {
      const currentValue = prevUserData[resourceKey] || 0;
      const newValue = Math.max(
        0,
        Math.min(maxValue, currentValue + increment),
      );
      return {
        ...prevUserData,
        [resourceKey]: newValue,
      };
    });
  };

  const handleResourceInputChange = (resourceKey, maxValue, event) => {
    const value = parseFloat(event.target.value) || 0;
    const clampedValue = Math.max(0, Math.min(maxValue, value));
    setUserData((prevUserData) => ({
      ...prevUserData,
      [resourceKey]: clampedValue,
    }));
  };

  return (
    <main className="w-full min-h-screen bg-linear-to-b from-[#0b0f1a] via-[#0b0f1a] to-[#0f1424]">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* Auto Save Indicator */}
      <AutoSaveIndicator
        isSaving={autoSaveState.isSaving}
        error={autoSaveState.error}
        lastSaved={autoSaveState.lastSaved}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full space-y-8 p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Main Sections */}
        <div className="space-y-6">
          <IdentitySection userData={userData} />

          <PersonalSection
            userData={userData}
            onInputChange={handleInputChange}
          />

          <MentalWorldSection
            userData={userData}
            onInputChange={handleInputChange}
          />

          <VitalResourcesSection
            userData={userData}
            localLife={localLife()}
            localEnergy={localEnergy()}
            onResourceChange={handleResourceChange}
            onInputChange={handleResourceInputChange}
          />

          <ProgressionSection
            userData={userData}
            onInputChange={handleInputChange}
          />
        </div>
      </div>
    </main>
  );
}
