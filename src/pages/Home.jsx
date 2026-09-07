import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../components/ui/Button'
import { Pill } from '../components/ui/Pill'
import { Timer } from '../components/ui/Timer'

const Page = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`

const Container = styled.div`
  width: min(100% - 48px, 1120px);
  margin: 0 auto;
  @media (max-width: 640px) { width: min(100% - 32px, 1120px); }
`

const Nav = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0;
  @media (max-width: 640px) { padding: 16px 0; }
`

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  img { width: 32px; height: 32px; object-fit: contain; }
`

const Eyebrow = styled.p`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Hero = styled.section`
  display: grid;
  gap: 48px;
  padding: 56px 0 72px;
  @media (min-width: 900px) {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
  }
`

const Headline = styled.h1`
  font-size: clamp(2rem, 4vw, 2.75rem);
  line-height: 1.15;
  margin: 0 0 20px;
  color: ${({ theme }) => theme.colors.text};
`

const Lede = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.muted};
  max-width: 46ch;
  margin: 0 0 28px;
`

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`

const DemoCard = styled.section`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`

const DemoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const DemoTitle = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
`

const EventRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  font-size: 0.9rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child { border-bottom: none; }
`

const EventTime = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-variant-numeric: tabular-nums;
`

const Section = styled.section`
  padding: 56px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const SectionHead = styled.div`
  max-width: 620px;
  margin-bottom: 36px;
  h2 {
    font-size: clamp(1.5rem, 2.5vw, 1.9rem);
    margin: 0 0 10px;
    color: ${({ theme }) => theme.colors.text};
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 1.02rem;
  }
`

const FeatureGrid = styled.div`
  display: grid;
  gap: 20px;
  @media (min-width: 700px) { grid-template-columns: repeat(2, 1fr); }
`

const FeatureCard = styled.div`
  padding: 22px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
`

const FeatureTitle = styled.h3`
  font-size: 1.05rem;
  margin: 12px 0 8px;
  color: ${({ theme }) => theme.colors.text};
`

const FeatureBody = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.95rem;
`

const RoleGrid = styled.div`
  display: grid;
  gap: 20px;
  @media (min-width: 760px) { grid-template-columns: repeat(2, 1fr); }
`

const RoleCard = styled.div`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
`

const RoleTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.text};
`

const RoleMuted = styled.p`
  margin: 0 0 18px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
`

const RoleList = styled.ul`
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 10px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
`

const StackRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const CtaBand = styled.section`
  padding: 56px 0 72px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`

const CtaHeadline = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.text};
`

const CtaMuted = styled.p`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.colors.muted};
`

const CtaActions = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
`

const Footer = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 24px 0;
`

const FooterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
`

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

export function HomePage() {
  return (
    <Page>
      <Container>
        <Nav>
          <Brand to="/login">
            <img src="/logo.svg" alt="" />
            Procteria
          </Brand>
          <Button as={Link} to="/login">Sign in</Button>
        </Nav>

        <Hero>
          <div>
            <Eyebrow>Proctored assessment platform</Eyebrow>
            <Headline>Run timed technical assessments you can actually trust.</Headline>
            <Lede>
              Procteria assigns timed, autosaving assessments with a server-synced clock and
              browser-level proctoring — so admins get a real record, not just a final score.
            </Lede>
            <HeroActions>
              <Button as={Link} to="/login">Sign in</Button>
              <Button as="a" href="#features" variant="secondary">See how it works</Button>
            </HeroActions>
          </div>

          <DemoCard>
            <DemoHeader>
              <DemoTitle>Live attempt · Systems Design Round</DemoTitle>
              <Timer minutes={42} active warningMinutes={5} />
            </DemoHeader>
            <EventRow>
              <span>Attempt started, fullscreen entered</span>
              <EventTime>00:00:04</EventTime>
            </EventRow>
            <EventRow>
              <Pill tone="warning">Flagged</Pill>
              <EventTime>00:12:31</EventTime>
            </EventRow>
            <EventRow>
              <span>Answer autosaved · Question 5</span>
              <EventTime>00:15:20</EventTime>
            </EventRow>
            <EventRow>
              <Pill tone="success">Submitted</Pill>
              <EventTime>00:44:52</EventTime>
            </EventRow>
          </DemoCard>
        </Hero>

        <Section id="features">
          <SectionHead>
            <h2>What actually happens during an attempt</h2>
            <p>Four things Procteria handles so a completed assessment means something.</p>
          </SectionHead>
          <FeatureGrid>
            <FeatureCard>
              <Pill tone="info">Timing</Pill>
              <FeatureTitle>Server-synced countdown</FeatureTitle>
              <FeatureBody>
                The timer shown to a candidate periodically re-syncs against the server's
                remaining-time value, so local clock drift or tab refreshes don't extend an attempt.
              </FeatureBody>
            </FeatureCard>
            <FeatureCard>
              <Pill tone="warning">Proctoring</Pill>
              <FeatureTitle>Browser-level signal capture</FeatureTitle>
              <FeatureBody>
                Tab switches, window blur, fullscreen exits, and copy, paste, or right-click
                attempts are each logged with a timestamp against the attempt.
              </FeatureBody>
            </FeatureCard>
            <FeatureCard>
              <Pill tone="neutral">Autosave</Pill>
              <FeatureTitle>Answers save as candidates type</FeatureTitle>
              <FeatureBody>
                Every answer change autosaves, and an attempt resumes exactly where it left off
                after a refresh or a dropped connection.
              </FeatureBody>
            </FeatureCard>
            <FeatureCard>
              <Pill tone="success">Scoring</Pill>
              <FeatureTitle>Objective auto-scoring</FeatureTitle>
              <FeatureBody>
                Single choice and multiple choice questions are scored the moment an attempt is
                submitted; short answers queue for a reviewer alongside the full attempt record.
              </FeatureBody>
            </FeatureCard>
          </FeatureGrid>
        </Section>

        <Section>
          <SectionHead>
            <h2>One workspace, two roles</h2>
            <p>Admins build and assign; candidates attempt and submit. Each gets exactly what they need.</p>
          </SectionHead>
          <RoleGrid>
            <RoleCard>
              <RoleTitle>Administrator</RoleTitle>
              <RoleMuted>Build, assign, and review</RoleMuted>
              <RoleList>
                <li>Create assessments from a shared question bank</li>
                <li>Configure duration, expiry, and proctoring rules per assignment</li>
                <li>Assign to candidates and track status at a glance</li>
                <li>Review scores, timestamps, and the proctoring log per submission</li>
              </RoleList>
            </RoleCard>
            <RoleCard>
              <RoleTitle>Candidate</RoleTitle>
              <RoleMuted>Attempt and submit</RoleMuted>
              <RoleList>
                <li>See every assessment assigned, with its status and deadline</li>
                <li>Take a timed attempt that autosaves as they go</li>
                <li>Resume in place after a refresh or dropped connection</li>
                <li>View results once an attempt has been reviewed</li>
              </RoleList>
            </RoleCard>
          </RoleGrid>
        </Section>

        <Section>
          <SectionHead>
            <h2>Built with</h2>
          </SectionHead>
          <StackRow>
            <Pill tone="neutral">React 18</Pill>
            <Pill tone="neutral">Vite</Pill>
            <Pill tone="neutral">Material UI</Pill>
            <Pill tone="neutral">TanStack Query</Pill>
            <Pill tone="neutral">styled-components</Pill>
            <Pill tone="neutral">Node.js</Pill>
            <Pill tone="neutral">MongoDB</Pill>
            <Pill tone="neutral">JWT auth</Pill>
          </StackRow>
        </Section>
      </Container>

      <CtaBand>
        <Container>
          <CtaHeadline>Sign in to your workspace</CtaHeadline>
          <CtaMuted>Admin and candidate accounts both sign in from the same page.</CtaMuted>
          <CtaActions>
            <Button as={Link} to="/login">Sign in</Button>
          </CtaActions>
        </Container>
      </CtaBand>

      <Footer>
        <Container>
          <FooterRow>
            <span>© 2026 Procteria</span>
            <FooterLink href="https://github.com/Vrushabh99/Assessment-Frontend" target="_blank" rel="noopener noreferrer">
              View source on GitHub
            </FooterLink>
          </FooterRow>
        </Container>
      </Footer>
    </Page>
  )
}