# Contributing to Unishare

Thank you for your interest in contributing to Unishare! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Development Environment Setup](#development-environment-setup)
  - [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Pull Requests](#pull-requests)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Commit Messages](#commit-messages)
  - [Testing](#testing)
- [Style Guidelines](#style-guidelines)
  - [Rust Code Style](#rust-code-style)
  - [TypeScript/JavaScript Code Style](#typescriptjavascript-code-style)
- [Community](#community)

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to [conduct@unishare.app](mailto:conduct@unishare.app).

## Getting Started

### Development Environment Setup

1. **Prerequisites**
   - [Rust](https://www.rust-lang.org/tools/install) (latest stable)
   - [Node.js](https://nodejs.org/) (v16 or later)
   - [Tauri CLI](https://tauri.app/v1/guides/getting-started/setup)
   - For macOS development: Xcode
   - For Windows development: Visual Studio build tools

2. **Clone the repository**
   ```bash
   git clone https://github.com/unishare/unishare.git
   cd unishare
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the development environment**
   ```bash
   npm run tauri dev
   ```

### Project Structure

```
unishare/
├── src/                  # Front-end TypeScript/JavaScript code
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # React components
│   ├── hooks/            # React hooks
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main application component
├── src-tauri/            # Rust backend code
│   ├── src/              # Rust source files
│   │   ├── connection/   # Connection methods implementations
│   │   ├── security/     # Security and Midnight integration
│   │   └── main.rs       # Main Rust entry point
│   └── Cargo.toml        # Rust dependencies
├── tests/                # Test files
└── package.json          # Node.js dependencies
```

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the [Issues](https://github.com/unishare/unishare/issues).
2. If not, create a new issue using the bug report template.
3. Include detailed steps to reproduce the bug, expected behavior, and actual behavior.
4. Add information about your operating system and Unishare version.
5. If possible, include screenshots or video recordings.

### Suggesting Features

1. Check if the feature has already been requested in the [Issues](https://github.com/unishare/unishare/issues).
2. If not, create a new issue using the feature request template.
3. Describe the feature in detail, explain why it would be valuable, and suggest how it might be implemented.

### Pull Requests

1. Fork the repository.
2. Create a new branch from `main` with a descriptive name (e.g., `fix-bluetooth-detection`).
3. Make your changes in the new branch.
4. Add or update tests as necessary.
5. Ensure all tests pass by running `npm test`.
6. Update documentation if needed.
7. Create a pull request to the `main` branch.
8. Reference any related issues in the pull request description.

## Development Workflow

### Branching Strategy

- `main`: Stable branch containing the latest release
- `dev`: Development branch for integration of features
- `feature/*`: Feature branches (e.g., `feature/wifi-direct-improvements`)
- `fix/*`: Bug fix branches (e.g., `fix/connection-timeout`)

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to the build process or tools

Example: `feat(connection): add retry mechanism for WebRTC connections`

### Testing

- Write unit tests for Rust code using the built-in testing framework.
- Write tests for TypeScript/JavaScript code using Jest.
- Ensure that all tests pass before submitting a pull request.
- Add integration tests for new features.

Run tests with:
```bash
# Rust tests
cd src-tauri && cargo test

# TypeScript/JavaScript tests
npm test
```

## Style Guidelines

### Rust Code Style

- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/).
- Use `rustfmt` to format your code.
- Run `cargo clippy` to catch common mistakes and improve your code.

### TypeScript/JavaScript Code Style

- Follow the project's ESLint configuration.
- Use TypeScript for new code.
- Format your code using Prettier.

## Community

- Join our [Discord server](https://discord.gg/unishare) for real-time discussions.
- Participate in [Discussions](https://github.com/unishare/unishare/discussions) for feature ideas and general conversation.
- Help answer questions from other contributors and users.

---

Thank you for contributing to Unishare! Your efforts help make cross-platform file sharing better for everyone.