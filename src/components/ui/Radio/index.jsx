import PropTypes from 'prop-types'
import MuiRadio from '@mui/material/Radio'

/**
 * <Radio checked={selected} onChange={(value) => ...} name="question-3" value="option-1" />
 *
 * Note: unlike CheckBox, a single Radio button's onChange fires with the
 * VALUE of whichever radio was just selected (event.target.value), since
 * radios are normally grouped by a shared `name` and the parent needs to
 * know which one fired, not just "true".
 */
export function Radio({ checked, onChange, disabled, name, ...rest }) {
  return (
    <MuiRadio
      checked={checked}
      disabled={disabled}
      name={name}
      onChange={(event) => onChange?.(event.target.value, event)}
      color="primary"
      {...rest}
    />
  )
}

Radio.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  name: PropTypes.string,
}

Radio.defaultProps = {
  onChange: undefined,
  disabled: false,
  name: undefined,
}