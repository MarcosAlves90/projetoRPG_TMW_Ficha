import { useContext } from "react";
import { UserContext } from "../UserContext";
import { usePageUnmount } from "@/hooks/usePageUnmount.js";
import { useAutoSave } from "@/hooks/useAutoSave.js";
import { AutoSaveIndicator } from "@/assets/components/AutoSaveIndicator.jsx";
import { Section, TextArea } from "@/assets/components/design-system";
import { BookOpen, Sparkles, Heart, AlertCircle, Zap } from "lucide-react";

export default function Page2() {
  const { userData, setUserData } = useContext(UserContext);

  // Garante sincronização ao sair da página
  usePageUnmount();

  // Salvamento automático com debounce de 2s
  const autoSaveState = useAutoSave(userData, 2000);

  const handleInputChange = (key) => (event) => {
    const { value } = event.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [key]: value,
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
        {/* Origem Section */}
        <Section
          key="origem"
          title="Origem"
          subtitle="A história e contexto do seu personagem"
          className="animate-fade-in"
        >
          <TextArea
            key="origem-field"
            label="Sua Origem"
            icon={BookOpen}
            value={userData.origem || ""}
            onChange={handleInputChange("origem")}
            placeholder="Escreva a história e contexto do seu personagem. Como você chegou até aqui? Qual é sua motivação?"
            rows={6}
          />
        </Section>

        {/* Aparência Section */}
        <Section
          key="aparencia"
          title="Aparência"
          subtitle="Descrição física e visual"
          className="animate-fade-in"
        >
          <TextArea
            key="fisico-field"
            label="Descrição Física"
            icon={Sparkles}
            value={userData.fisico || ""}
            onChange={handleInputChange("fisico")}
            placeholder="Como você se parece? Descreva sua aparência, roupas, características marcantes..."
            rows={4}
          />
        </Section>

        {/* Ideais Section */}
        <Section
          key="ideais"
          title="Ideais"
          subtitle="Princípios e valores"
          className="animate-fade-in"
        >
          <TextArea
            key="ideais-field"
            label="Seus Ideais"
            icon={Zap}
            value={userData.ideais || ""}
            onChange={handleInputChange("ideais")}
            placeholder="Quais são seus ideais? O que você acredita e valoriza? Qual é seu código de honra?"
            rows={4}
          />
        </Section>

        {/* Traços Section */}
        <Section
          key="tracos"
          title="Traços Pessoais"
          subtitle="Características positivas e negativas"
          className="animate-fade-in"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traços Negativos */}
            <div key="tracos-negativos">
              <TextArea
                key="tracos-negativos-field"
                label="Traços Negativos"
                icon={AlertCircle}
                value={userData.tracosNegativos || ""}
                onChange={handleInputChange("tracosNegativos")}
                placeholder="Quais são suas fraquezas? Medos? Defeitos que você reconhece em si mesmo?"
                rows={4}
                variant="negative"
              />
            </div>

            {/* Traços Positivos */}
            <div key="tracos-positivos">
              <TextArea
                key="tracos-positivos-field"
                label="Traços Positivos"
                icon={Heart}
                value={userData.tracosPositivos || ""}
                onChange={handleInputChange("tracosPositivos")}
                placeholder="Quais são suas forças? Virtudes? Qualidades que definem você?"
                rows={4}
                variant="positive"
              />
            </div>
          </div>
        </Section>

        {/* Origem da Forma Section */}
        <Section
          key="origem-forma"
          title="Origem da Forma"
          subtitle="A história de sua transformação ou poder"
          className="animate-fade-in"
        >
          <TextArea
            key="origem-forma-field"
            label="História da Forma"
            icon={BookOpen}
            value={userData.origemForma || ""}
            onChange={handleInputChange("origemForma")}
            placeholder="Como você obteve seus poderes ou forma atual? O que desencadeou essa transformação? Há alguma maldição ou bênção envolvida?"
            rows={7}
          />
        </Section>
      </div>
    </main>
  );
}
