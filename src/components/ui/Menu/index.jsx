import { useRef, useState } from 'react'
import { MenuContainer, MenuButton, MenuDropdown, MenuItem, MenuDivider } from './styles'

/* eslint-disable react/prop-types */
export function Menu({ trigger, items, icon, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const handleItemClick = (item) => {
    item.onClick?.()
    setIsOpen(false)
  }

  return (
    <MenuContainer ref={menuRef}>
      <MenuButton
        $isOpen={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        {trigger}
      </MenuButton>
      {isOpen && (
        <MenuDropdown role="menu">
          {items.map((item, index) => (
            item.isDivider ? (
              <MenuDivider key={`divider-${index}`} />
            ) : (
              <MenuItem
                key={item.id || index}
                role="menuitem"
                $danger={item.danger}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                {item.label}
              </MenuItem>
            )
          ))}
        </MenuDropdown>
      )}
    </MenuContainer>
  )
}
