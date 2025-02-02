# :gear: Vite Mock API Plugin

`vite-mock-api` is a Vite plugin that allows you to easily create and manage mock API endpoints for development. By defining simple mock handlers, you can simulate API responses without needing a separate backend, improving development speed and efficiency.

## :package: NPM Package

(Coming Soon) – This package will be available on [NPM](https://www.npmjs.com/).

## Features

- **Easy Mock API Setup**: Just define your mock API handlers in a dedicated folder.
- **Automatic Bundling**: Uses [esbuild](https://esbuild.github.io/) to bundle mock handlers from TypeScript to CommonJS.
- **Middleware Integration**: Registers mock endpoints as middleware in the Vite development server.
- **Development-Only Activation**: The plugin runs only in development mode and does not affect production builds.
- **Enhanced Request Handling**: Parses query parameters and request bodies automatically.
- **Supports Custom Middleware**: Allows adding third-party middleware (e.g., `body-parser`).
- **File Watching**: Automatically reloads mock handlers when changes are detected. (watching `{mockFilesDir}/index.ts`, default `mockFilesDir` = `"mock-api"`)

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

To use the plugin, import it and add it to your Vite configuration file (`vite.config.ts`).

### Example Configuration

#### Basic usage.

```typescript
import { defineConfig } from "vite";
import mockApiPlugin from "vite-mock-api";

export default defineConfig({
  plugins: [mockApiPlugin()],
  // default mockFilesDir = "mock-api"
});
```

#### Add plugin option.

```typescript
export default defineConfig({
  plugins: [
    mockApiPlugin({
      mockFilesDir: "my-mock-api", // Optional: Change the mock API directory
      middlewares: [], // Optional: Add custom middleware functions
    }),
  ],
});
```

## Setting Up Your Mock API Handlers

1. **Create a `/{mockFilesDir}` Directory**: In the root of your project, create a directory called `{mockFilesDir}`.

   (default `mockFilesDir` = `"mock-api"`)

2. **Define Your API Handlers**: Inside the `{mockFilesDir}` folder, create an `index.ts` file and export mock handlers.

### Example Handler

```typescript
// my-mock-api/index.ts

import {
  MockHandler,
  MockApiHandlerRequest,
  MockApiHandlerResponse,
} from "vite-mock-api";

const helloHandler: MockHandler = {
  path: "/api/hello",
  handler: (req: MockApiHandlerRequest, res: MockApiHandlerResponse) => {
    console.log(req.headers, req.query, req.params); // check your terminal console.
    res.json({ message: "Hello, world!" }); // check your web console.
  },
};

export default [helloHandler];
```

### Test above Request handler

A request to:

```
GET http://localhost:5173/api/hello?name=John
```

will result in the following response:

```json
{
  "message": "Hello, world!"
}
```

## How It Works

1. The plugin scans the `/{mockFilsDir}/index.ts` file when the Vite development server starts.
2. It bundles the mock handlers into a CommonJS module using esbuild.
3. The bundled mock handlers are dynamically imported and registered as middleware in the Vite dev server.
4. Requests matching the specified paths are intercepted and handled by the mock handlers.
5. The plugin watches for changes in the mock API files and reloads the handlers automatically.

## Request & Response Enhancements

- **Query Parameters**: Automatically parsed and available in `req.query` and `req.params`.
- **Request Body**: Automatically parsed and accessible via `req.body`.
- **Custom JSON Response**: The response object has a `json(data)` method for sending JSON responses.
- **Custom Middleware**: Allows third-party middleware (e.g., `body-parser`) to be added before mock API handlers.

## Custom Middleware Support

If you want request with `body(POST, PATCH, PUT method)` request, you can add middleware functions to process requests before they reach mock handlers. See example code below.

### Example Using `body-parser`

```typescript
import bodyParser from "body-parser";
import mockApiPlugin from "vite-mock-api";

export default defineConfig({
  plugins: [
    mockApiPlugin({
      middlewares: [bodyParser.json()],
    }),
  ],
});
```

## Troubleshooting

- **Missing Mock Handlers**: Ensure your `/{mockFilesDir}` directory and `index.ts` file exist.
- **Development Mode**: The plugin only runs in development mode (`vite` or `npm run dev`).
- **Bundling Issues**: If esbuild fails, check your console logs for error messages.
- **Correct Export Format**: Your `index.ts` file should export an array of handlers as the default export.
- **File Watching Not Working**: Ensure the file path is correctly set in `mockFilesDir`.

## License

This plugin is licensed under the [MIT License](./LICENSE).

## Contributing

Contributions are welcome! If you have suggestions, find issues, or want to add features, feel free to open an issue or submit a pull request.

## Author

- Maintainer: [Insoo Park(Humanwater)](https://github.com/lunaticscode)
- Email: lunatics384@gmail.com
