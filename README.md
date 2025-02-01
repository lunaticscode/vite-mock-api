# :gear: Vite Mock API Plugin

`vite-mock-api` is a Vite plugin that allows you to easily create and manage mock API endpoints for development. By defining simple mock handlers, you can simulate API responses without needing a separate backend, improving development speed and efficiency.

## :package: NPM Package

(Coming Soon) – This package will be available on [NPM](https://www.npmjs.com/).

## Features

- **Easy Mock API Setup**: Just define your mock API handlers in a dedicated folder.
- **Automatic Bundling**: Uses [esbuild](https://esbuild.github.io/) to bundle mock handlers from TypeScript to CommonJS.
- **Middleware Integration**: Registers mock endpoints as middleware in the Vite development server.
- **Enhanced Request Handling**: Parses query parameters and request bodies automatically.
- **Development-Only Activation**: The plugin runs only in development mode and does not affect production builds.

## Installation

To install the plugin, run:

```bash
npm install -D vite-mock-api
```

or

```bash
yarn add -D vite-mock-api
```

or

```bash
pnpm add -D vite-mock-api
```

## Usage

To use the plugin, import it and add it to your Vite configuration file (`vite.config.ts` or `vite.config.js`).

### Example Configuration

```typescript
import { defineConfig } from "vite";
import mockApiPlugin from "vite-mock-api";

export default defineConfig({
  plugins: [mockApiPlugin()],
});
```

## Setting Up Your Mock API Handlers

1. **You should create a `/mock-api` Directory**: In the root of your project, create a directory called `mock-api`.
2. **Define Your API Handlers**: Inside the `mock-api` folder, create an `index.ts` file and export mock handlers.

### Example Handler

```typescript
// mock-api/index.ts

import {
  MockHandler,
  MockApiHandlerRequest,
  MockApiHandlerResponse,
} from "vite-mock-api";

const helloHandler: MockHandler = {
  path: "/api/hello",
  handler: (req: MockApiHandlerRequest, res: MockApiHandlerResponse) => {
    res.json({ message: "Hello, world!" });
  },
};

export default helloHandler;
```

## How It Works

1. The plugin scans the `/mock-api/index.ts` file when the Vite development server starts.
2. It bundles the mock handlers into a CommonJS module using esbuild.
3. The bundled mock handlers are dynamically imported and registered as middleware in the Vite dev server.
4. Requests matching the specified paths are intercepted and handled by the mock handlers.

## Request & Response Enhancements

- **Query Parameters**: Automatically parsed and available in `req.query` and `req.params`.
- **Request Body**: Automatically parsed and accessible via `req.body`.
- **Custom JSON Response**: The response object has a `json(data)` method for sending JSON responses.

## Troubleshooting

- **Missing Mock Handlers**: Ensure your `/mock-api` directory and `index.ts` file exist.
- **Development Mode**: The plugin only runs in development mode.
- **Bundling Issues**: If esbuild fails, check your console logs for error messages in terminal.

## License

This plugin is licensed under the [MIT License](./LICENSE).

## Contributing

Contributions are welcome! If you have suggestions, find issues, or want to add features, feel free to open an issue or submit a pull request.

## Author

- Maintainer: [HumanWater(Insoo Park)](https://github.com/lunaticscode)
- Email: lunatics384@gmail.com
