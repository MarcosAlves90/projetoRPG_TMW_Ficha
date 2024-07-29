import PropTypes from "prop-types";

export default function Header(props) {
    return (
        <>
            <div className={"header"}>
                <div className={"header infos"}>
                    <button className={`button-header ${props.showBackButton ? "active" : ""}`}
                            onClick={props.onBack}
                            disabled={!props.showBackButton}
                            style={props.showBackButton ? {cursor: "Pointer"} : {cursor: "default"}}>
                        Voltar
                    </button>
                    <h1 className={"title-container"}><span className={"title-h1"}>{props.titulo}</span></h1>
                    <button className={`button-header ${props.showNextButton ? "active" : ""}`}
                            onClick={props.onNext}
                            disabled={!props.showNextButton}
                            style={props.showNextButton ? {cursor: "Pointer"} : {cursor: "default"}}>
                        Próximo
                    </button>
                </div>
            </div>
        </>
    );
}

Header.propTypes = {
    titulo: PropTypes.string.isRequired,
    showBackButton: PropTypes.bool,
    showNextButton: PropTypes.bool,
    onBack: PropTypes.func,
    onNext: PropTypes.func
};