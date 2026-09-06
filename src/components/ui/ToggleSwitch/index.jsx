import PropTypes from 'prop-types'
import styled from 'styled-components'

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  user-select: none;
`

const Track = styled.span`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: ${({ $checked, theme }) => ($checked ? theme.colors.primary : theme.colors.border)};
  transition: background 0.15s ease;
  flex-shrink: 0;
`

const Thumb = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ $checked }) => ($checked ? '20px' : '2px')};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: left 0.15s ease;
`

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

const Text = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`

/**
 * <ToggleSwitch checked={showCorrectAnswer} onChange={setShowCorrectAnswer} label="Show correct answers" />
 */
export function ToggleSwitch({ checked, onChange, label, disabled = false, id }) {
  return (
    <Label htmlFor={id} $disabled={disabled}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <HiddenCheckbox
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          onChange={(event) => onChange?.(event.target.checked)}
        />
        <Track $checked={checked}>
          <Thumb $checked={checked} />
        </Track>
      </span>
      {label && <Text>{label}</Text>}
    </Label>
  )
}

ToggleSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
}

ToggleSwitch.defaultProps = {
  onChange: undefined,
  label: undefined,
  disabled: false,
  id: undefined,
}