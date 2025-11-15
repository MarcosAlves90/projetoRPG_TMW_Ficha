import { Link } from "react-router-dom";

export default function EnterButton() {
  const playClickSound = () => {
    const audio = new Audio("/sounds/click-mainpage-button.mp3");
    audio.play().catch((error) => {
      console.log("Erro ao reproduzir o som:", error);
    });
  };

  return (
    <Link to="/individual">
      <button
        onClick={playClickSound}
        className="
            cursor-pointer 
            uppercase 
            tracking-[0.5rem] 
            text-[#3b82f6] 
            px-20
            py-4
            max-md:py-3
            max-md:px-15
            font-bold
            font-futura
            text-base md:text-lg lg:text-xl
            border-t 
            border-b 
            border-[#3b82f6]
            transition-all 
            duration-300 
            ease-in-out
            relative
            overflow-hidden
            hover:animate-[gridPulse_1.5s_ease-in-out_infinite]
        "
        style={{
          background: `
                    radial-gradient(circle, rgba(59, 130, 246, 0.36) 0%, rgba(0, 0, 0, 0) 95%),
                    linear-gradient(rgba(59, 130, 246, 0.073) 1px, transparent 1px),
                    linear-gradient(to right, rgba(59, 130, 246, 0.073) 1px, transparent 1px)
                    `,
          backgroundSize: "cover, 15px 15px, 15px 15px",
          backgroundPosition: "center center, center center, center center",
          borderImage:
            "radial-gradient(circle, rgb(59, 130, 246) 0%, rgba(0, 0, 0, 0) 100%) 1",
          filter: "hue-rotate(0deg)",
        }}
      >
        Entrar
      </button>
    </Link>
  );
}
