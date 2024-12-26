# BuildIn.ai Proxy and Customization Tool

This project is a **Cloudflare Worker** script that acts as a proxy for [BuildIn.ai](https://www.buildin.ai/), a powerful productivity and collaboration tool similar to Notion. The script allows you to customize and modify the BuildIn.ai interface, enabling you to tailor it to your specific needs. It supports URL redirections, modifies HTML and JavaScript responses, and injects custom styles, scripts, and metadata into the BuildIn.ai web interface.

## Features

- **URL Redirection**: Redirects specific slugs to predefined pages within BuildIn.ai.
- **Response Modification**:
  - Replaces specific phrases in JavaScript files to customize functionality.
  - Modifies HTML content to inject custom metadata, fonts, and styles.
- **Dynamic Logo Replacement**: Automatically replaces the BuildIn.ai logo with a custom logo.
- **Custom Styling**: Hides unnecessary elements on the BuildIn.ai interface for a cleaner look.
- **CORS Support**: Handles CORS preflight requests for cross-origin resource sharing.

## Why Use This Proxy?

BuildIn.ai is a versatile productivity tool, but you may want to:
- **Brand the Interface**: Replace the default logo and styling to match your brand.
- **Customize Metadata**: Modify page titles and descriptions for SEO or branding purposes.
- **Remove Unwanted Elements**: Hide certain UI elements to simplify the interface for your users.
- **Inject Custom Scripts**: Add additional functionality or analytics to the BuildIn.ai interface.

This proxy allows you to achieve all of the above without modifying the original BuildIn.ai service.

## Configuration

The script is highly configurable through the following constants:

| Constant             | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| `FAST_MODE`          | Disables certain modifications for faster response times.                   |
| `MY_DOMAIN`          | Your custom domain for URL redirection and asset proxying.                  |
| `MAIN_PAGE`          | Your main page ID in BuildIn.ai.                                            |
| `PAGE_TITLE`         | Custom title for the web pages.                                             |
| `PAGE_DESCRIPTION`   | Custom meta description for the web pages.                                  |
| `GOOGLE_FONT`        | Google Font to be injected into the pages.                                  |
| `LOGOTYPE`           | URL of the custom logo to replace the BuildIn.ai logo.                      |
| `PHRASE_REPLACEMENTS`| A dictionary of phrases to be replaced in JavaScript files.                 |

## How It Works

1. **Request Handling**:
   - The worker intercepts incoming requests and checks if the URL path matches a predefined slug.
   - If a match is found, the user is redirected to the corresponding page within BuildIn.ai.
   - API requests to `/api/users/me` are blocked with a `204 No Content` response.

2. **Proxying**:
   - Requests are proxied to the BuildIn.ai domain (`https://www.buildin.ai`).
   - Responses are modified based on their content type:
     - **HTML**: Custom metadata, fonts, styles, and scripts are injected.
     - **JavaScript**: Specific phrases are replaced using a dictionary.

3. **Dynamic Modifications**:
   - The BuildIn.ai logo is dynamically replaced with a custom logo.
   - Unnecessary elements (e.g., buttons, footers) are hidden using injected CSS.

## Example Configuration

```javascript
const FAST_MODE = false;
const MY_DOMAIN = "somedomain.ru";
const MAIN_PAGE = "dc49b6c1-1234-4b62-8745-491354878412"; // Root page
const PAGE_TITLE = "Your page title here";
const PAGE_DESCRIPTION = "Your page description here";
const GOOGLE_FONT = "Rubik";
const LOGOTYPE = "https://example.com/custom-logo.png";
