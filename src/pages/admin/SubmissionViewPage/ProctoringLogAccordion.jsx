import { useState, useMemo } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import { Pill } from '../../../components/ui/Pill'
import { formatDate } from '../../../utils/helpers'
import styled from 'styled-components'

const WrapperDiv = styled.div`
  width: 150px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 1.5em;
`;

const CountButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
`;

const AUTOSAVE_TYPES = new Set(['attempt_autosaved', 'attempt_autosave'])

const EVENT_LABELS = {
  tab_switch: 'Tab switch',
  window_blur: 'Window blur',
  fullscreen_exit: 'Fullscreen exit',
  copy: 'Copy',
  paste: 'Paste',
  right_click: 'Right click',
  attempt_start: 'Attempt started',
  attempt_submit: 'Attempt submitted',
  attempt_flag: 'Attempt flagged',
  attempt_autosave: 'Autosaved',
  attempt_reset: 'Attempt reset',
  attempt_graded: 'Graded'
}

const EVENT_COLORS = {
  tab_switch: 'warning',
  window_blur: 'warning',
  fullscreen_exit: 'warning',
  copy: 'warning',
  paste: 'warning',
  right_click: 'warning',
  attempt_start: 'info',
  attempt_submit: 'success',
  attempt_flag: 'warning',
  attempt_autosave: 'default',
  attempt_reset: 'warning',
  attempt_graded: 'success'
}

export function ProctoringLogAccordion({ events = [] }) {
  const [showAutosaves, setShowAutosaves] = useState(false)
  const [expandedTypes, setExpandedTypes] = useState(() => new Set())

  const visibleEvents = useMemo(() => {
    return showAutosaves
      ? events
      : events.filter((event) => !AUTOSAVE_TYPES.has(event.type))
  }, [events, showAutosaves])

  const groupedEvents = useMemo(() => {
    const groups = new Map()
    for (const event of visibleEvents) {
      if (!groups.has(event.type)) {
        groups.set(event.type, [])
      }
      groups.get(event.type).push(event)
    }
    // sort each group's entries newest-first
    for (const list of groups.values()) {
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }
    // sort groups by their most recent entry, newest-first
    return [...groups.entries()].sort(
      ([, a], [, b]) => new Date(b[0].timestamp).getTime() - new Date(a[0].timestamp).getTime()
    )
  }, [visibleEvents])

  const autosaveCount = useMemo(
    () => events.filter((event) => AUTOSAVE_TYPES.has(event.type)).length,
    [events]
  )

  const toggleExpanded = (type) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  return (
    <Accordion variant="outlined" disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Title>
          Proctoring Logs ({visibleEvents.length})
        </Title>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0 }}>
        {autosaveCount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={showAutosaves}
                  onChange={(e) => setShowAutosaves(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label={`Show autosaves (${autosaveCount})`}
              sx={{ m: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </Box>
        )}

        {groupedEvents.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No log entries.
          </Typography>
        ) : (
          <List dense disablePadding>
            {groupedEvents.map(([type, group], index) => {
              const isExpanded = expandedTypes.has(type)
              const latest = group[0]

              return (
                <Box key={type}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem disableGutters sx={{ py: 1 }}>
                    <WrapperDiv>
                      <Pill tone={EVENT_COLORS[type]}>
                        {EVENT_LABELS[type]}
                      </Pill>
                    </WrapperDiv>
                    {` `}
                    :
                    {` `}
                    {group.length > 1 ? (
                      <CountButton
                        onClick={() => toggleExpanded(type)}
                        aria-expanded={isExpanded}
                      >
                        <Pill>
                          {group.length} events. 
                        </Pill>
                      </CountButton>
                    ) : (
                      <>
                      <WrapperDiv>
                        <Pill tone='neutral'>
                          {formatDate(latest.timestamp, { seconds: true })}
                        </Pill>
                      </WrapperDiv>
                      </>
                    )}
                  </ListItem>

                  {group.length > 1 && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List dense disablePadding sx={{ pl: 3 }}>
                        {group.map((event, i) => (
                          <ListItem key={`${type}-${event.timestamp}-${i}`} disableGutters sx={{ py: 0.5 }}>
                            <WrapperDiv>
                              <Pill tone='neutral'>
                                {formatDate(event.timestamp, { seconds: true })}
                              </Pill>
                            </WrapperDiv>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              )
            })}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
  )
}