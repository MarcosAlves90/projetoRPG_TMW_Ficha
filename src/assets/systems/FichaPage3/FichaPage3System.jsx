import PropTypes from "prop-types";
import { useContext } from "react";
import { arcColors, atrColors, bioColors } from "../../styles/CommonStyles.jsx";
import { UserContext } from "../../../UserContext.jsx";
import styled from "styled-components";

const StatusTextField = styled.input`
  border-width: 3px;
  text-align: center;
  border-color: var(--gray-border-color);
  &:hover,
  &:focus {
    border-color: var(--gray-border-color);
  }
`;

const BonusStatusTextField = styled.input`
  text-align: center;
`;

const perArrayPropType = PropTypes.arrayOf(
  PropTypes.shape({
    pericia: PropTypes.string.isRequired,
    atr: PropTypes.string.isRequired,
  }),
);

const arcArrayPropType = PropTypes.arrayOf(
  PropTypes.shape({
    art: PropTypes.string.isRequired,
  }),
);

const subArcArrayPropType = PropTypes.arrayOf(
  PropTypes.shape({
    subArt: PropTypes.string.isRequired,
    art: PropTypes.string.isRequired,
  }),
);

function handleKeyPress(event) {
  if (event.ctrlKey && (event.key === "a" || event.key === "c")) return;
  if (
    !/[0-9]/.test(event.key) &&
    ![
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Tab",
      "ArrowUp",
      "ArrowDown",
    ].includes(event.key)
  ) {
    event.preventDefault();
  }
}

export function Biotipos({ biotipo, handleInputChange }) {
  const { userData } = useContext(UserContext);

  return (
    <div className="input-group mb-3">
      <div className="text-div">
        <span
          className={`input-group-text-left defined ${userData.isLocked ? "locked" : ""}`}
          style={{
            backgroundColor: bioColors[biotipo].background,
            color: bioColors[biotipo].color,
            border: `${bioColors[biotipo].background} 2px solid`,
          }}
        >
          {biotipo}
        </span>
      </div>
      <StatusTextField
        type="number"
        step={1}
        min={0}
        className="form-control input-status"
        placeholder="0"
        value={userData[`biotipo-${biotipo}`] || ""}
        onChange={handleInputChange(`biotipo-${biotipo}`)}
        onKeyDownCapture={handleKeyPress}
        style={
          userData.isLocked
            ? { borderColor: bioColors[biotipo].background }
            : {}
        }
        id={`label-${biotipo}`}
        disabled={userData.isLocked}
      />
    </div>
  );
}

Biotipos.propTypes = {
  biotipo: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

const getTruAttrName = {
  DES: "Destreza",
  FOR: "Força",
  INT: "Inteligência",
  PRE: "Presença",
  VIG: "Vigor",
};

export function Attributes({ atributo, atr, handleInputChange, rollDice }) {
  const { userData } = useContext(UserContext);

  return (
    <div className="input-group mb-3">
      <div className="text-div">
        <span
          className={`input-group-text-left defined attribute ${userData.isLocked ? "locked" : ""}`}
          id={`button-${atributo}`}
          onClick={rollDice}
          style={{
            backgroundColor: atrColors[atr].background,
            color: atrColors[atr].color,
            border: `${atrColors[atr].background} 2px solid`,
          }}
        >
          {getTruAttrName[atributo]}
        </span>
      </div>
      <StatusTextField
        type="number"
        step={1}
        min={0}
        className="form-control input-status border-right-none"
        placeholder="0"
        value={userData[`atributo-${atr}`] || ""}
        onChange={handleInputChange(`atributo-${atr}`)}
        onKeyDownCapture={handleKeyPress}
        style={
          userData.isLocked ? { borderColor: atrColors[atr].background } : {}
        }
        id={`label-${atributo}`}
        disabled={userData.isLocked}
      />
      <BonusStatusTextField
        type="number"
        step={1}
        min={0}
        className="form-control input-status input-bonus"
        placeholder="0"
        value={userData[`atributo-${atr}-bonus`] || ""}
        onChange={handleInputChange(`atributo-${atr}-bonus`)}
        onKeyDownCapture={handleKeyPress}
        style={
          userData.isLocked ? { borderColor: atrColors[atr].background } : {}
        }
        id={`label-${atributo}-bonus`}
        disabled={userData.isLocked}
      />
    </div>
  );
}

Attributes.propTypes = {
  atributo: PropTypes.string.isRequired,
  atr: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  rollDice: PropTypes.func.isRequired,
};

export function PericiasSection({ rollDice, handleInputChange, perArray }) {
  return (
    <div className={"input-center justify-center min"}>
      {perArray.map(({ pericia, atr }, index) => (
        <div className="input-center justify-center" key={index}>
          <Pericia
            pericia={pericia}
            atr={atr}
            key={pericia}
            rollDice={rollDice}
            handleInputChange={handleInputChange}
          />
        </div>
      ))}
    </div>
  );
}

PericiasSection.propTypes = {
  rollDice: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  perArray: perArrayPropType.isRequired,
};

function Pericia({ pericia, atr, handleInputChange, rollDice }) {
  const { userData } = useContext(UserContext);

  return (
    <div className="input-group mb-3">
      <span
        className="input-group-text-left"
        style={{
          backgroundColor: atrColors[atr].background,
          color: atrColors[atr].color,
        }}
      >
        {atr}
      </span>
      <span
        className="input-group-text-center pericia"
        id={`button-${pericia}`}
        onClick={rollDice}
        style={
          userData.isLocked
            ? { borderColor: `${atrColors[atr].background}` }
            : {}
        }
      >
        {pericia}
      </span>
      <StatusTextField
        type="number"
        step={1}
        min={0}
        className="form-control input-status border-right-none"
        placeholder="0"
        value={userData[`pericia-${pericia}`] || ""}
        onChange={handleInputChange(`pericia-${pericia}`)}
        onKeyDownCapture={handleKeyPress}
        id={`label-${pericia}`}
        disabled={userData.isLocked}
        style={
          userData.isLocked
            ? { borderColor: `${atrColors[atr].background}` }
            : {}
        }
      />
      <BonusStatusTextField
        type="number"
        step={1}
        min={0}
        className="form-control input-status input-bonus"
        placeholder="0"
        value={userData[`pericia-${pericia}-bonus`] || ""}
        onChange={handleInputChange(`pericia-${pericia}-bonus`)}
        onKeyDownCapture={handleKeyPress}
        id={`label-${pericia}-bonus`}
        disabled={userData.isLocked}
        style={
          userData.isLocked
            ? { borderColor: `${atrColors[atr].background}` }
            : {}
        }
      />
    </div>
  );
}

Pericia.propTypes = {
  pericia: PropTypes.string.isRequired,
  atr: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  rollDice: PropTypes.func.isRequired,
};

export function ArtsSection({ handleInputChange, arcArray }) {
  return (
    <div className={"input-center justify-center min"}>
      <div className="input-center justify-center">
        {arcArray.map(({ art }) => (
          <ArcaneArts
            art={art}
            key={art}
            handleInputChange={handleInputChange}
          />
        ))}
      </div>
    </div>
  );
}

ArtsSection.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  arcArray: arcArrayPropType.isRequired,
};

const getTruArcName = {
  DES: "Destruição",
  LEV: "Levitação",
  LIB: "Liberação",
  MAN: "Manipulação",
  IMA: "Imaginação",
  MOD: "Modificação",
  CRI: "Criação",
};

export function ArcaneArts({ art, handleInputChange }) {
  const { userData } = useContext(UserContext);

  return (
    <div className="input-group mb-3">
      <div className="text-div">
        <span
          className={`input-group-text-left defined ${userData.isLocked ? "locked" : ""}`}
          style={{
            backgroundColor: arcColors[art].background,
            color: arcColors[art].color,
            border: `${arcColors[art].background} 2px solid`,
          }}
        >
          {getTruArcName[art]}
        </span>
      </div>
      <StatusTextField
        type="number"
        step={1}
        min={0}
        className="form-control input-status"
        placeholder="0"
        value={userData[`art-${art}`] || ""}
        onChange={handleInputChange(`art-${art}`)}
        onKeyDownCapture={handleKeyPress}
        style={
          userData.isLocked ? { borderColor: arcColors[art].background } : {}
        }
        id={`label-${art}`}
        disabled={userData.isLocked}
      />
    </div>
  );
}

ArcaneArts.propTypes = {
  art: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export function SubArtsSection({ handleInputChange, subArcArray }) {
  return (
    <div className={"input-center justify-center min"}>
      {subArcArray.map(({ subArt, art }) => (
        <div className="input-center justify-center" key={subArt}>
          <SubArcaneArts
            subArt={subArt}
            art={art}
            handleInputChange={handleInputChange}
          />
        </div>
      ))}
    </div>
  );
}

SubArtsSection.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  subArcArray: subArcArrayPropType.isRequired,
};

export function SubArcaneArts({ subArt, art, handleInputChange }) {
  const { userData } = useContext(UserContext);

  return (
    <div className="input-group mb-3">
      <span
        className="input-group-text-left"
        style={{
          backgroundColor: arcColors[art].background,
          color: arcColors[art].color,
        }}
      >
        {art}
      </span>
      <span
        className="input-group-text-center"
        style={
          userData.isLocked
            ? { borderColor: `${arcColors[art].background}` }
            : {}
        }
      >
        {subArt}
      </span>
      <StatusTextField
        type="number"
        step={1}
        min={0}
        className="form-control input-status"
        placeholder="0"
        value={userData[`subArt-${subArt}`] || ""}
        onChange={handleInputChange(`subArt-${subArt}`)}
        onKeyDownCapture={handleKeyPress}
        id={`label-${subArt}`}
        disabled={userData.isLocked}
        style={
          userData.isLocked
            ? { borderColor: `${arcColors[art].background}` }
            : {}
        }
      />
    </div>
  );
}

SubArcaneArts.propTypes = {
  subArt: PropTypes.string.isRequired,
  art: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};
