import styled from 'styled-components'

const tones = {
  neutral: {
    background: '#f2f4f7',
    color: '#344054',
  },
  info: {
    background: '#eef1ff',
    color: '#4055c7',
  },
  warning: {
    background: '#fff4e5',
    color: '#b54708',
  },
  success: {
    background: '#e7f6ec',
    color: '#18713b',
  },
}

export const PillContent = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  background: ${({ $tone }) => tones[$tone]?.background || tones.neutral.background};
  color: ${({ $tone }) => tones[$tone]?.color || tones.neutral.color};
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
`
