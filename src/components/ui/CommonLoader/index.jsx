import { Loader, LoaderLabel, LoaderWrapper } from './styles'

/* eslint-disable react/prop-types */
export function CommonLoader({ label = 'Loading...' }) {
  return (
    <LoaderWrapper role="status" aria-label={label}>
      <Loader aria-hidden="true" />
      <LoaderLabel>{label}</LoaderLabel>
    </LoaderWrapper>
  )
}
