import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useContext,
  useRef,
} from "react";
import { usePageUnmount } from "@/hooks/usePageUnmount.js";
import { useToast } from "@/hooks/useToast.js";
import {
  ArtsSection,
  Attributes,
  Biotipos,
  PericiasSection,
  SubArtsSection,
} from "../assets/systems/FichaPage3/FichaPage3System.jsx";
import {
  arcArray,
  atrMap,
  bioMap,
  perArray,
  subArcArray,
} from "../assets/systems/FichaPage3/FichaPage3Arrays.jsx";
import { saveUserData } from "../firebaseUtils.js";
import { map } from "jquery";
import { UserContext } from "../UserContext.jsx";
import { Button, Section, Badge } from "@/assets/components/design-system";
import {
  Search,
  AlertCircle,
  ShieldAlert,
  Lock,
  LockOpen,
  Dices,
} from "lucide-react";



export default function Page3() {
  // Garante sincronização ao sair da página
  usePageUnmount();

  const [totalPoints, setTotalPoints] = useState({
    bioPoints: 0,
    atrPoints: 0,
    perPoints: 0,
    arcPoints: 0,
    subArcPoints: 0,
  });

  const [recommendations, setRecommendations] = useState(false);
  const [tempRoll, setTempRoll] = useState({
    Pericia: "",
    Dice: "",
    Result: 0,
  });

  const [noStatusDice, setNoStatusDice] = useState([[]]);
  const [searchTerm, setSearchTerm] = useState("");
  const { userData, setUserData, user } = useContext(UserContext);
  const { toast } = useToast();
  const debounceTimeout = useRef(null);

  const saveDataDebounced = useCallback(
    (data) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        if (user) {
          saveUserData(data);
        }
      }, 500);
    },
    [user],
  );

  const calculateTotalPoints = useCallback(() => {
    const newTotalPoints = {
      bioPoints: 0,
      atrPoints: 0,
      perPoints: 0,
      arcPoints: 0,
      subArcPoints: 0,
    };

    Object.keys(userData).forEach((key) => {
      const value = parseFloat(userData[key]);
      const validValue = isNaN(value) ? 0 : value;

      if (!key.includes("Points") && !key.endsWith("-bonus")) {
        if (key.startsWith("biotipo-")) {
          newTotalPoints.bioPoints += validValue;
        } else if (key.startsWith("atributo-")) {
          newTotalPoints.atrPoints += validValue;
        } else if (key.startsWith("pericia-")) {
          newTotalPoints.perPoints += validValue;
        } else if (key.startsWith("art-")) {
          newTotalPoints.arcPoints += validValue;
        } else if (key.startsWith("subArt-")) {
          newTotalPoints.subArcPoints += validValue;
        }
      }
    });

    setTotalPoints(newTotalPoints);
  }, [userData]);

  useEffect(() => {
    saveDataDebounced(userData);
  }, [userData, saveDataDebounced]);

  useEffect(() => {
    calculateTotalPoints();
  }, [calculateTotalPoints]);

  const handleInputChange = (key) => (event) => {
    const { value, type } = event.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [key]:
        type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const handleElementChange = (key) => (value) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [key]: value,
    }));
  };

  const handleLockChange = () => {
    const lock = !userData.isLocked;
    handleElementChange("isLocked")(lock);
  };

  const CalculateAttributesPoints = useCallback(() => {
    const nivel = userData.nivel || 1;
    if (nivel < 4) {
      return 9;
    } else if (nivel < 10) {
      return 10;
    } else if (nivel < 16) {
      return 11;
    } else if (nivel < 19) {
      return 12;
    } else {
      return 13;
    }
  }, [userData.nivel]);

  const CalculateAttributesCap = useCallback(() => {
    const nivel = userData.nivel || 1;

    if (nivel < 4) {
      return 3;
    } else if (nivel < 10) {
      return 4;
    } else {
      return 5;
    }
  }, [userData.nivel]);

  const CalculatePericiasPoints = useCallback(() => {
    const nivel = userData.nivel || 1;
    const bPericias = userData["biotipo-Pericias"] || 0;
    const aInt = userData["atributo-INT"] || 0;

    if (bPericias === 0 || aInt === 0) {
      return 0;
    } else if (bPericias === 1) {
      return (3 + aInt) * nivel + nivel * 2;
    } else if (bPericias === 2) {
      return (5 + aInt) * nivel + nivel * 2;
    } else if (bPericias === 3) {
      return (7 + aInt) * nivel + nivel * 2;
    } else {
      return -1;
    }
  }, [userData]);

  const CalculatePericiasCap = useCallback(() => {
    return userData.nivel || 1;
  }, [userData.nivel]);

  const rollDice = (e, simpleDice) => {
    let diceResult = 0;
    const dice = [];
    let noAttribute = false;

    // const emojis = {
    //   1: "💀",
    //   2: "🤡",
    //   3: "😔",
    //   4: "😟",
    //   5: "🙁",
    //   6: "😐",
    //   7: "🙂",
    //   8: "😀",
    //   9: "😃",
    //   10: "😄",
    //   11: "😁",
    //   12: "😎",
    //   13: "🥶",
    // };

    // const emojiMap = {
    //   1: 1,
    //   2: 2,
    //   3: 2,
    //   4: 2,
    //   5: 2,
    //   6: 3,
    //   7: 4,
    //   8: 5,
    //   9: 5,
    //   10: 6,
    //   11: 6,
    //   12: 6,
    //   13: 6,
    //   14: 7,
    //   15: 8,
    //   16: 9,
    //   17: 10,
    //   18: 11,
    //   19: 12,
    //   20: 13,
    // };

    // const selectEmoji = (result) => emojiMap[result] || null;

    const notify = (message) => toast.info(`${message}`);

    function rollSimpleDice(qty, sides) {
      for (let i = 0; i < qty; i++) {
        dice.push(Math.floor(Math.random() * sides) + 1);
      }
    }

    function simpleDiceSum() {
      return dice.reduce((acc, curr) => acc + curr, 0);
    }

    function chooseSimpleDiceResult() {
      if (simpleDice.sum) {
        diceResult = simpleDiceSum();
      } else {
        chooseMinOrMax(false);
      }
    }

    function notifyRoll(periciaNameProp, diceProp, resultProp) {
      notify(`${periciaNameProp}: [${diceProp}] = ${resultProp}`);
    }

    function verifyAttribute(atr, bonus) {
      if (atr + bonus === 0) return [true, 2, bonus];
      return [false, atr, bonus];
    }

    function rollAttributeDice(atr, bonus) {
      for (let i = 0; i < atr + bonus; i++) {
        dice.push(Math.floor(Math.random() * 20) + 1);
      }
    }

    function chooseMinOrMax(noAtr) {
      if (!noAtr) {
        diceResult = Math.max(...dice);
      } else {
        diceResult = Math.min(...dice);
      }
    }

    function addPericiaBonus(bonus) {
      diceResult += bonus;
    }

    if (atrMap.includes(e.target.id.slice(7))) {
      const attributeName = e.target.id.slice(7);
      let attribute = userData[`atributo-${attributeName}`] || 0;
      let attributeBonus = userData[`atributo-${attributeName}-bonus`] || 0;

      [noAttribute, attribute, attributeBonus] = verifyAttribute(
        attribute,
        attributeBonus,
      );

      rollAttributeDice(attribute, attributeBonus);
      chooseMinOrMax(noAttribute);
      notifyRoll(attributeName, dice, diceResult);
      setTempRoll({
        Pericia: attributeName,
        Dice: dice.join(", "),
        Result: diceResult,
      });
    } else if (
      perArray.map((per) => per.pericia).includes(e.target.id.slice(7))
    ) {
      const periciaName = e.target.id.slice(7);
      const pericia = userData[`pericia-${periciaName}`] || 0;
      const periciaBonus = userData[`pericia-${periciaName}-bonus`] || 0;
      let attribute = map(perArray, function (per) {
        if (per.pericia === periciaName) {
          return userData[`atributo-${per.atr}`] || 0;
        }
        return null;
      });
      let attributeBonus = map(perArray, function (per) {
        if (per.pericia === periciaName) {
          return userData[`atributo-${per.atr}-bonus`] || 0;
        }
        return null;
      });

      attribute = attribute.length > 0 ? attribute[0] : 0;
      attributeBonus = attributeBonus.length > 0 ? attributeBonus[0] : 0;

      [noAttribute, attribute, attributeBonus] = verifyAttribute(
        attribute,
        attributeBonus,
      );
      rollAttributeDice(attribute, attributeBonus);
      chooseMinOrMax(noAttribute);
      addPericiaBonus(periciaBonus);

      const result = diceResult + pericia;

      notifyRoll(periciaName, dice, result);
      setTempRoll({
        Pericia: periciaName,
        Dice: dice.join(", "),
        Result: result,
      });
    } else {
      rollSimpleDice(simpleDice.qty, simpleDice.sides);
      chooseSimpleDiceResult();
      notifyRoll("N/A", dice, diceResult);
      setTempRoll({
        Pericia: "N/A",
        Dice: dice.join(", "),
        Result: diceResult,
      });
    }
  };

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value.toLowerCase());
  }, []);

  const handleNoStatusDiceChange = useCallback((event) => {
    setNoStatusDice(event.target.value.toLowerCase());
  }, []);

  const noStatusDiceRoll = useCallback(() => {
    const regex = /(\d+)d(\d+)(kh\d+|kh)?/g;
    const symbolRegex = /[+\-*/]/g;
    const numberRegex = /(?<!\d)d?\b\d+\b(?!d)/g;
    const matches = noStatusDice.match(regex);
    const symbols = noStatusDice.match(symbolRegex) || [];
    const isolatedNumbers = noStatusDice.match(numberRegex)?.map(Number) || [];

    const notify = (message) => toast.info(`${message}`);

    if (!matches) {
      console.error("No valid dice notation found");
      return;
    }

    const rollDice = (num, sides) =>
      Array.from({ length: num }, () => Math.floor(Math.random() * sides) + 1);
    const calculateResult = (diceArray) =>
      diceArray.reduce((acc, val) => acc + val, 0);

    const newNoStatusDice = matches.map((match) => {
      const [, num1, num2, kh] = match.match(/(\d+)d(\d+)(kh\d+|kh)?/);
      return [
        parseInt(num1, 10),
        parseInt(num2, 10),
        kh ? (kh === "kh" ? "kh1" : kh) : "c",
      ];
    });

    const results = newNoStatusDice.map(([num, sides, type]) => {
      const diceResults = rollDice(num, sides);
      if (type.startsWith("kh")) {
        diceResults.sort((a, b) => b - a);
        return {
          results: diceResults,
          result: calculateResult(
            diceResults.slice(0, parseInt(type.slice(2), 10)),
          ),
        };
      }
      return { results: diceResults, result: calculateResult(diceResults) };
    });

    let finalResult = results[0].result;
    let symbolIndex = 0;
    let isolatedNumberIndex = 0;

    const formattedDice = noStatusDice.replace(regex, (match, p1, p2, p3) => {
      const index = matches.indexOf(match);
      const diceResults = results[index].results;
      if (p3 && p3.startsWith("kh")) {
        const keepHighest = parseInt(p3.slice(2), 10);
        const keptResults = diceResults
          .slice(0, keepHighest)
          .map((result) => `(${result})`);
        const otherResults = diceResults.slice(keepHighest);
        return `[${[...otherResults, ...keptResults].join(", ")}]`;
      }
      return `[${diceResults.join(", ")}]`;
    });

    for (let i = 0; i < symbols.length; i++) {
      if (symbolIndex < results.length - 1) {
        switch (symbols[i]) {
          case "+":
            finalResult += results[symbolIndex + 1].result;
            break;
          case "-":
            finalResult -= results[symbolIndex + 1].result;
            break;
          case "*":
            finalResult *= results[symbolIndex + 1].result;
            break;
          case "/":
            finalResult /= results[symbolIndex + 1].result;
            break;
          default:
            break;
        }
        symbolIndex++;
      } else if (isolatedNumberIndex < isolatedNumbers.length) {
        switch (symbols[i]) {
          case "+":
            finalResult += isolatedNumbers[isolatedNumberIndex];
            break;
          case "-":
            finalResult -= isolatedNumbers[isolatedNumberIndex];
            break;
          case "*":
            finalResult *= isolatedNumbers[isolatedNumberIndex];
            break;
          case "/":
            finalResult /= isolatedNumbers[isolatedNumberIndex];
            break;
          default:
            break;
        }
        isolatedNumberIndex++;
      }
    }

    while (isolatedNumberIndex < isolatedNumbers.length) {
      finalResult += isolatedNumbers[isolatedNumberIndex];
      isolatedNumberIndex++;
    }

    setTempRoll({
      Pericia: "comum",
      Dice: formattedDice,
      Result: finalResult,
    });

    const truncatedFormattedDice =
      formattedDice.length > 60
        ? `${formattedDice.slice(0, 60)}...`
        : formattedDice;
    notify(`${truncatedFormattedDice} = ${finalResult}`);
  }, [noStatusDice, toast]);

  const filteredBioMap = useMemo(
    () => bioMap.filter((item) => item.toLowerCase().includes(searchTerm)),
    [searchTerm],
  );

  const filteredAtrMap = useMemo(
    () => atrMap.filter((item) => item.toLowerCase().includes(searchTerm)),
    [searchTerm],
  );

  const filteredPerArray = useMemo(
    () =>
      perArray.filter((item) =>
        item.pericia.toLowerCase().includes(searchTerm),
      ),
    [searchTerm],
  );

  const filteredArcArray = useMemo(
    () =>
      arcArray.filter((item) => item.art.toLowerCase().includes(searchTerm)),
    [searchTerm],
  );

  const filteredSubArcArray = useMemo(
    () =>
      subArcArray.filter((item) =>
        item.subArt.toLowerCase().includes(searchTerm),
      ),
    [searchTerm],
  );

  useEffect(() => {
    const diceLength = Math.min(tempRoll.Dice.length, 15);
    document.documentElement.style.setProperty(
      "--text-length",
      `${diceLength}`,
    );
  }, [tempRoll.Dice]);

  return (
    <main className="w-full min-h-screen bg-linear-to-b from-[#0b0f1a] via-[#0b0f1a] to-[#0f1424]">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full space-y-8 p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Dice Roll Display Section */}
        <Section title="Resultado da Rolagem" className="animate-fade-in">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-4 text-center">
                <div className="text-sm text-gray-400 mb-2">Perícia/Atributo</div>
                <div className="text-xl font-bold text-white">
                  {tempRoll.Pericia ? tempRoll.Pericia : "Nenhum"}
                </div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-sm text-gray-400 mb-2">Dados</div>
                <div className="text-lg font-mono text-blue-300 break-all">
                  {`${tempRoll.Dice.slice(0, 60)}${tempRoll.Dice.length > 60 ? "..." : ""}`}
                </div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-sm text-gray-400 mb-2">Resultado</div>
                <div className="text-3xl font-bold text-green-400">
                  {tempRoll.Result ? tempRoll.Result : 0}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Options Section */}
        <Section title="Opções e Ferramentas" className="animate-fade-in">
          <div className="space-y-6">
            {/* Action Buttons and Search */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                <Button
                  variant={userData.isLocked ? "secondary" : "primary"}
                  onClick={handleLockChange}
                  className="w-full lg:w-auto min-w-[180px] gap-2"
                >
                  {userData.isLocked ? <Lock size={18} /> : <LockOpen size={18} />}
                  {userData.isLocked ? "Bloqueado" : "Desbloqueado"}
                </Button>
                <Button
                  variant={recommendations ? "secondary" : "ghost"}
                  onClick={() => setRecommendations(!recommendations)}
                  className="w-full lg:w-auto min-w-[180px] gap-2"
                >
                  {recommendations ? <ShieldAlert size={18} /> : <AlertCircle size={18} />}
                  Regras
                </Button>
              </div>
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar status..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="input-focus w-full pl-10"
                />
              </div>
            </div>

            {/* Rules/Recommendations Display */}
            {recommendations && (
              <div className="card bg-blue-600/10 border-blue-500/30 animate-scale-in">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-blue-300 mb-3">Máximo de pontos em cada categoria:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p className="text-gray-300">• Biotipo: máximo <Badge variant="primary">3</Badge></p>
                    <p className="text-gray-300">• Atributos: máximo <Badge variant="primary">{CalculateAttributesCap()}</Badge></p>
                    <p className="text-gray-300">• Perícias: máximo <Badge variant="primary">{CalculatePericiasCap()}</Badge></p>
                    <p className="text-gray-300">• Artes e Subartes: máximo <Badge variant="primary">15</Badge></p>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Dice Roll */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Dices size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Escreva seu dado (ex: 2d20, 1d6+3)..."
                  value={noStatusDice}
                  onChange={handleNoStatusDiceChange}
                  className="input-focus w-full pl-10"
                />
              </div>
              <Button
                variant="success"
                onClick={noStatusDiceRoll}
                className="w-full lg:w-auto min-w-[140px] gap-2"
              >
                <Dices size={18} />
                Rolar
              </Button>
            </div>
          </div>
        </Section>

        {/* Biotipo Section */}
        {filteredBioMap.length > 0 && (
          <Section
            title={`Biotipo: [${totalPoints.bioPoints}]/[9]`}
            subtitle="O biotipo representa a essência do personagem, seu estado natural sem treinos, modificações ou conhecimentos."
            className="animate-fade-in"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBioMap.map((biotipo) => (
                <Biotipos
                  key={biotipo}
                  biotipo={biotipo}
                  handleInputChange={handleInputChange}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Atributos Section */}
        {filteredAtrMap.length > 0 && (
          <Section
            title={`Atributos: [${totalPoints.atrPoints}]/[${CalculateAttributesPoints()}]`}
            subtitle="Os atributos são os status principais do personagem. Eles guiam as perícias e as (sub)artes arcanas."
            className="animate-fade-in"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAtrMap.map((atr) => (
                <Attributes
                  key={atr}
                  atributo={atr}
                  atr={atr}
                  handleInputChange={handleInputChange}
                  rollDice={rollDice}
                />
              ))}
            </div>
          </Section>
        )}
        {/* Perícias Section */}
        {filteredPerArray.length > 0 && (
          <Section
            title={`Perícias: [${totalPoints.perPoints}]/[${
              !userData.nivel || userData.nivel === "" || isNaN(userData.nivel)
                ? "Verifique seu nível"
                : CalculatePericiasPoints() > 0
                  ? CalculatePericiasPoints()
                  : CalculatePericiasPoints() === 0
                    ? "Preencha o Biotipo e Atributos"
                    : "Biotipo maior do que o esperado"
            }]`}
            subtitle="As perícias são os conhecimentos e habilidades naturais do personagem, elas determinam aquilo que ele sabe ou não fazer."
            className="animate-fade-in"
          >
            <PericiasSection
              rollDice={rollDice}
              handleInputChange={handleInputChange}
              perArray={filteredPerArray}
            />
          </Section>
        )}

        {/* Artes Section */}
        {filteredArcArray.length > 0 && (
          <Section
            title={`Artes: [${totalPoints.arcPoints}]/[${(userData["pericia-Magia Arcana"] || 0) * 5}]`}
            subtitle="As artes arcanas são os focos de conhecimento em magia arcana do personagem, definindo em quais ações ele é melhor."
            className="animate-fade-in"
          >
            <ArtsSection
              handleInputChange={handleInputChange}
              arcArray={filteredArcArray}
            />
          </Section>
        )}

        {/* Subartes Section */}
        {filteredSubArcArray.length > 0 && (
          <Section
            title={`Subartes: [${totalPoints.subArcPoints}]/[${(userData["pericia-Magia Arcana"] || 0) * 5}]`}
            subtitle="As subartes arcanas são as especializações das artes arcanas do personagem, aumentando as possibilidades de skills."
            className="animate-fade-in"
          >
            <SubArtsSection
              handleInputChange={handleInputChange}
              subArcArray={filteredSubArcArray}
            />
          </Section>
        )}
      </div>
    </main>
  );
}
