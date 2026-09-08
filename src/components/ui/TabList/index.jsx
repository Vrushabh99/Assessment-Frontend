import { useRef } from 'react'
import PropTypes from 'prop-types'
import { TabList, Tab } from './styles'

Tab.propTypes = {
  $active: PropTypes.bool,
}

Tab.defaultProps = {
  $active: false,
}

/**
 * Drop-in replacement for the raw <TabList role="tablist">...</TabList> markup
 * shown in usage — same TAB_FILTERS/activeTab/setActiveTab shape, but adds
 * roving-tabindex arrow-key navigation between tabs, which role="tablist"
 * implies but plain onClick handlers alone don't give you for free.
 *
 * <Tabs
 *   tabs={TAB_FILTERS}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * />
 */
export function Tabs({ tabs, activeTab, onChange, idPrefix }) {
  const tabRefs = useRef([])

  const focusTab = (index) => {
    const target = tabRefs.current[index]
    if (target) target.focus()
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      const next = (index + 1) % tabs.length
      onChange(tabs[next].id)
      focusTab(next)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      const prev = (index - 1 + tabs.length) % tabs.length
      onChange(tabs[prev].id)
      focusTab(prev)
    } else if (event.key === 'Home') {
      event.preventDefault()
      onChange(tabs[0].id)
      focusTab(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      onChange(tabs[tabs.length - 1].id)
      focusTab(tabs.length - 1)
    }
  }

  return (
    <TabList role="tablist">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id
        return (
          <Tab
            key={tab.id}
            ref={(el) => { tabRefs.current[index] = el }}
            id={idPrefix ? `${idPrefix}-tab-${tab.id}` : undefined}
            role="tab"
            type="button"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            aria-controls={idPrefix ? `${idPrefix}-panel-${tab.id}` : undefined}
            $active={isActive}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </Tab>
        )
      })}
    </TabList>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  idPrefix: PropTypes.string,
}

Tabs.defaultProps = {
  idPrefix: undefined,
}