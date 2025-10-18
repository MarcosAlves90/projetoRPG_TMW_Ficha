import PropTypes from 'prop-types';
import styled from 'styled-components';
import {IconButton} from "@mui/material";
import {Add, Remove} from '@mui/icons-material';

const VitalResourceContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;
`;

const VitalResourceHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    
    .resource-label {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-family: var(--common-font-family), sans-serif;
        font-weight: 500;
        font-size: 0.9rem;
        color: white;
        
        .MuiSvgIcon-root {
            opacity: 0.7;
            font-size: 1.2rem;
        }
    }
    
    .resource-value {
        font-family: var(--common-font-family), sans-serif;
        font-weight: bold;
        color: white;
        font-size: 0.9rem;
    }
`;

const VitalResourceBar = styled.div`
    position: relative;
    width: 100%;
    height: 24px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    overflow: hidden;
    border: 2px solid ${props => props.$color || 'rgba(255, 255, 255, 0.2)'};
    
    .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, 
            ${props => props.$color || '#4a90e2'} 0%, 
            ${props => props.$lightColor || '#6bb6ff'} 100%
        );
        transition: width 0.3s ease;
        border-radius: 4px;
    }
    
    .bar-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: var(--common-font-family), sans-serif;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        font-size: 0.75rem;
        pointer-events: none;
    }
`;

const VitalResourceControls = styled.div`
    display: flex;
    gap: 0.3rem;
    align-items: center;
    justify-content: center;
    
    .MuiIconButton-root {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        padding: 0.25rem;
        
        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        &:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        
        .MuiSvgIcon-root {
            font-size: 1rem;
        }
    }
    
    input {
        width: 50px;
        padding: 0.25rem;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        color: white;
        font-family: var(--common-font-family), sans-serif;
        font-weight: 500;
        font-size: 0.85rem;
        
        &:focus {
            outline: none;
            border-color: ${props => props.$color || 'rgba(255, 255, 255, 0.5)'};
        }
    }
`;

export default function VitalResource({
    label,
    icon: Icon,
    currentKey,
    currentValue,
    maxValue,
    color,
    lightColor,
    onResourceChange,
    onInputChange
}) {
    const percentage = (currentValue / maxValue) * 100;

    return (
        <VitalResourceContainer>
            <VitalResourceHeader>
                <div className="resource-label">
                    {Icon && <Icon/>}
                    <span>{label}</span>
                </div>
                <span className="resource-value">{currentValue} / {maxValue}</span>
            </VitalResourceHeader>
            <VitalResourceBar $color={color} $lightColor={lightColor}>
                <div className="bar-fill" style={{width: `${percentage}%`}}/>
                <div className="bar-text">{Math.round(percentage)}%</div>
            </VitalResourceBar>
            <VitalResourceControls $color={color}>
                <IconButton
                    size="small"
                    onClick={() => onResourceChange(currentKey, maxValue, -10)}
                    disabled={currentValue === 0}
                >
                    <Remove fontSize="small"/>
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => onResourceChange(currentKey, maxValue, -1)}
                    disabled={currentValue === 0}
                >
                    <Remove fontSize="inherit"/>
                </IconButton>
                <input
                    type="number"
                    value={currentValue}
                    onChange={(e) => onInputChange(currentKey, maxValue, e)}
                    min={0}
                    max={maxValue}
                />
                <IconButton
                    size="small"
                    onClick={() => onResourceChange(currentKey, maxValue, 1)}
                    disabled={currentValue >= maxValue}
                >
                    <Add fontSize="inherit"/>
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => onResourceChange(currentKey, maxValue, 10)}
                    disabled={currentValue >= maxValue}
                >
                    <Add fontSize="small"/>
                </IconButton>
            </VitalResourceControls>
        </VitalResourceContainer>
    );
}

VitalResource.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    currentKey: PropTypes.string.isRequired,
    currentValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    lightColor: PropTypes.string.isRequired,
    onResourceChange: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
