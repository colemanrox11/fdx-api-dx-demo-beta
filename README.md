# FDX Developer Portal

A versioned developer portal for the Financial Data Exchange (FDX) API with support for multiple API versions.

## Structure

```
fdx-api-dx-demo-beta/
├── index.html                    # Main wrapper with version selection
├── static/                       # Shared static files
├── v/                           # Versioned portals
│   ├── 6.0.0/                  # Version 6.0.0 portal
│   │   ├── index.html          # Version-specific portal (embedded)
│   │   └── static/             # Version-specific static files
│   └── 6.0.2/                  # Version 6.0.2 portal
│       ├── index.html          # Version-specific portal (embedded)
│       └── static/             # Version-specific static files
└── updated-artifacts/           # Original updated artifacts
```

## Features

- **Version Selection**: Dropdown in the main header to switch between API versions
- **Embedded Portals**: Each version is embedded as an iframe within the main portal
- **Preserved Structure**: APIMatic portal maintains its original header and navigation
- **Seamless Navigation**: Version switching updates the embedded portal without losing context

## Usage

1. **Main Portal**: Access the main portal at `index.html` to see the landing page
2. **Specification Docs**: Click "Specification Docs" to view the APIMatic portal
3. **Version Switching**: Use the dropdown in the header to switch between versions (6.0.0 and 6.0.2)
4. **Direct Access**: Navigate directly to version-specific portals at `v/6.0.0/index.html` or `v/6.0.2/index.html`

## How It Works

- The main `index.html` provides a wrapper with navigation and version selection
- When "Specification Docs" is clicked, the APIMatic portal is embedded as an iframe
- Version selection updates the iframe source to load the appropriate versioned portal
- Each versioned portal (`v/6.0.0/index.html`, `v/6.0.2/index.html`) contains only the APIMatic widget without custom headers
- The APIMatic portal maintains its original structure and functionality

## Version Management

To add a new version:
1. Create a new folder under `v/` (e.g., `v/6.0.3/`)
2. Copy the structure from an existing version
3. Update the version dropdown options in the main `index.html`
4. Add version-specific static files as needed

## Technical Details

- Each versioned portal contains only the APIMatic widget without custom headers
- Version selection uses iframe src updates to switch between versions
- The main portal wrapper preserves the original APIMatic portal structure
- Static files are organized to minimize duplication
- CSS styling is shared from the main static folder for consistency