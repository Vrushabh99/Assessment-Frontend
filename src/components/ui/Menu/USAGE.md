/**
 * Menu Component - Usage Examples
 * 
 * A dropdown menu component for table actions and contextual menus.
 * Supports icons, disabled states, dividers, and danger actions.
 */

import { Menu } from './index'

/**
 * Basic usage with simple items
 */
export function BasicMenuExample() {
  return (
    <Menu
      trigger="Actions"
      items={[
        { id: 'edit', label: 'Edit', onClick: () => console.log('Edit clicked') },
        { id: 'delete', label: 'Delete', onClick: () => console.log('Delete clicked'), danger: true },
      ]}
    />
  )
}

/**
 * Usage with icons and dividers
 */
export function MenuWithIconsExample() {
  return (
    <Menu
      trigger="⋮"
      icon="🔽"
      items={[
        { id: 'view', label: 'View Details', icon: '👁️', onClick: () => {} },
        { id: 'edit', label: 'Edit', icon: '✏️', onClick: () => {} },
        { id: 'download', label: 'Download', icon: '⬇️', onClick: () => {} },
        { isDivider: true },
        { id: 'delete', label: 'Delete', icon: '🗑️', danger: true, onClick: () => {} },
      ]}
    />
  )
}

/**
 * Usage with disabled items
 */
export function MenuWithDisabledExample() {
  return (
    <Menu
      trigger="Actions"
      items={[
        { id: 'edit', label: 'Edit', onClick: () => {} },
        { id: 'duplicate', label: 'Duplicate', disabled: true, onClick: () => {} },
        { id: 'archive', label: 'Archive', onClick: () => {} },
      ]}
    />
  )
}

/**
 * Props Interface:
 * 
 * Menu:
 * - trigger (ReactNode): Button text/content to display
 * - items (Array): Array of menu items
 * - icon (ReactNode): Optional icon for the button
 * - disabled (Boolean): Disable the menu button
 * 
 * Item object:
 * - id (String): Unique identifier
 * - label (String): Display text
 * - onClick (Function): Callback when clicked
 * - icon (ReactNode): Optional icon
 * - danger (Boolean): Highlight as dangerous action (delete, etc)
 * - disabled (Boolean): Disable this item
 * - isDivider (Boolean): Render as divider instead of item
 * 
 * Example in a table row:
 * 
 * const actions = [
 *   { id: 'edit', label: 'Edit', onClick: () => navigate(`/edit/${id}`) },
 *   { id: 'view', label: 'View', onClick: () => navigate(`/view/${id}`) },
 *   { isDivider: true },
 *   { id: 'delete', label: 'Delete', danger: true, onClick: () => handleDelete(id) },
 * ]
 * 
 * return <Menu trigger="⋮" items={actions} />
 */
