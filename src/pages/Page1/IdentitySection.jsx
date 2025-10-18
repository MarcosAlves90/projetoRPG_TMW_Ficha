import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Box} from "@mui/material";
import ProfilePicUploader from "../../assets/components/ProfilePicUploader.jsx";

const SectionCommon = styled.section`
    width: 100%;
    margin-bottom: 1rem;

    &.sectionIdentity {
        padding: 0 2rem 2rem 2rem;
        width: 37rem;
        border-radius: 10px;
        background-color: rgba(23, 29, 46, 0.49);
        border: var(--gray-border);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        h3 {
            font-weight: bold;
            width: fit-content;
            padding: 0.5rem 1rem;
            background-color: var(--gray-border-color);
            border-radius: 0 0 10px 10px;
            margin-bottom: 1rem;
        }

        .pBox {
            margin-bottom: 1rem;
            color: var(--identity-outside-background);

            p {
                font-weight: bold;
                margin-bottom: 0.2rem;
            }

            p:last-child {
                margin-bottom: 0;
            }
        }

        .profile-pic-image {
            width: 11rem;
            height: 11rem;
            margin-right: 1rem;

            .custom-file-upload, .image-profile {
                width: 100%;
                height: 100%;
            }

            .image-profile {
                border-radius: 10px 0 0 10px;
                border: 4px solid #2a3554;
            }
        }

        .picBox {
            width: 100%;

            .textBox {
                background-color: var(--gray-border-color);
                padding: 0.5rem 1rem;
                text-align: left;
                border-radius: 0 10px 10px 0;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                p {
                    width: 100%;
                }

                p:last-child {
                    margin-bottom: 0;
                }
            }
        }

        @media (max-width: 991px) {
            width: fit-content;
            background-color: transparent;
            border: none;
            padding: 0;
            margin-bottom: 2rem;
            p, h3, .textBox {
                display: none !important;
            }

            .profile-pic-image {
                margin: 0;

                .image-profile, .filter {
                    border-radius: 50%;
                }
            }
        }
    }
`;

export default function IdentitySection({userData}) {
    return (
        <SectionCommon className="sectionIdentity">
            <h3>IDENTIFICADOR</h3>
            <Box className="pBox">
                <p>REGIÃO DE AGAMEMNON</p>
                <p>SECRETARIA DE SEGURANÇA PÚBLICA</p>
                <p>INSTITUTO DE IDENTIFICAÇÃO</p>
            </Box>
            <Box className="picBox d-flex">
                <ProfilePicUploader/>
                <Box className="textBox">
                    <p><strong>Nome:</strong> {`${userData.nome || ''}`}</p>
                    <p><strong>Nascimento:</strong> {`${userData.idade || ''}`}</p>
                    <p><strong>Título:</strong> {`${userData.titulo || ''}`}</p>
                    <p><strong>Categoria:</strong> SSP-SEV</p>
                </Box>
            </Box>
        </SectionCommon>
    );
}

IdentitySection.propTypes = {
    userData: PropTypes.object.isRequired,
};
