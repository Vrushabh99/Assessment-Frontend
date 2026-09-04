import { useState, useRef } from 'react'
import Popover from '@mui/material/Popover'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { MenuButton } from './styles'

export function Menu({ trigger, items, icon, disabled }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const triggerRef = useRef(null)
  const isOpen = Boolean(anchorEl)

  const handleOpen = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleItemClick = (item) => {
    item.onClick?.()
    handleClose()
  }

  return (
    <>
      <MenuButton
        ref={triggerRef}
        $isOpen={isOpen}
        disabled={disabled}
        onClick={handleOpen}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        {trigger}
      </MenuButton>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            },
          },
        }}
      >
        <MenuList role="menu" autoFocusItem={isOpen}>
          {items.map((item, index) =>
            item.isDivider ? (
              <Divider key={`divider-${index}`} />
            ) : (
              <MenuItem
                key={item.id || index}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                sx={{
                  color: item.danger ? 'error.main' : 'text.primary',
                  gap: 1.5,
                  py: 1.5,
                  px: 2,
                }}
              >
                {item.icon && (
                  <ListItemIcon sx={{ minWidth: 'auto', color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
            )
          )}
        </MenuList>
      </Popover>
    </>
  )
}