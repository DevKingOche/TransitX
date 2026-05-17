# Contributing to TransitX

Thank you for your interest! TransitX welcomes bug fixes, features, docs, and tests.

## Getting Started

1. Fork and clone the repo.
2. Follow [SETUP.md](../SETUP.md) to run locally.
3. Create a feature branch: `git checkout -b feature/your-feature`

## Development

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run start:dev

# Contracts
cd contracts && cargo test
```

## Commit Style

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat(shipments): add carrier assignment endpoint
fix(escrow): correct pickup milestone calculation
docs(arch): add dispute resolution diagram
test(carriers): add service unit tests
```

Types: `feat` · `fix` · `docs` · `refactor` · `test` · `chore`

## Pull Request Guidelines

- One feature or fix per PR.
- Include tests for new functionality.
- All checks must pass: `type-check`, `lint`, `test`.
- Fill in the PR template and reference related issues.

## Code Standards

- TypeScript strict mode — no `any` unless unavoidable.
- NestJS: use DTOs with class-validator and dependency injection.
- Rust/Soroban: `cargo fmt` + `cargo clippy` with zero warnings.
- No secrets in code — use environment variables.

## Reporting Issues

Use the GitHub issue templates (bug report / feature request).

## License

Contributions are licensed under Apache License 2.0.
