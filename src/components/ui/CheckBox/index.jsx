import PropTypes from 'prop-types'
import MuiCheckbox from '@mui/material/Checkbox'

/**
 * <CheckBox checked={selected} onChange={(checked) => ...} name="option-1" />
 *
 * Thin wrapper over MUI's Checkbox: normalizes onChange to hand back the
 * boolean directly (instead of the raw change event) since that's what
 * every call site actually wants, and fixes checked/disabled/name as the
 * primary API surface per your usage.
 */
export function CheckBox({ checked, onChange, disabled, name, children, ...rest }) {
  return (
    <MuiCheckbox
      checked={checked}
      disabled={disabled}
      name={name}
      onChange={(event) => onChange?.(event.target.checked, event)}
      color="primary"
      {...rest}
    />
  )
}

CheckBox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  name: PropTypes.string,
}

CheckBox.defaultProps = {
  onChange: undefined,
  disabled: false,
  name: undefined,
}