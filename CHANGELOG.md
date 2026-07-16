# Changelog

All notable changes to this project are documented here. Format loosely
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed
- A fast double-tap on an already-answered option no longer records a stale
  answer in the wrong slot and crashes the verdict screen.
- `getVerdict` rejects Symbol (and other exotic) inputs with a clean "Unknown"
  error instead of an opaque `TypeError`.
- The "Skip to the questions" link now moves keyboard focus into the card.

### Added
- Hardened test suite (92 tests, 100% line coverage on every module):
  adversarial-input, UI-abuse, full DOM verdict matrix, WebAudio synthesis via
  a stub, annotation-leak, and shell/brand/theme contract guards.

- Full three-tap quiz flow: device → need → visible marking resolves to one
  plain-language verdict, with conservative handling of "not sure" answers.
- Blueprint UI: live-annotating SVG plug diagram, Space Mono + Inter type,
  themed controls with full interaction states, synthesized sound + mute,
  and a two-column desktop / stacked phone layout.
- End-to-end jsdom integration test plus unit coverage of every
  need × marking combination.
- Initial scaffold: repo layout, decision-tree core module, question copy,
  CI, and the vision/design/backlog docs.
