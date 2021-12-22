import { marked, renderSSR, jsx, Helmet } from "./deps.js";
import {
  BASE_PATH,
  headers,
  maybeReadmeFiles,
  NPM_PROVIDER_URL,
} from "./constants.js";
import Package from './components/package.js';

async function requestHandler(request) {
  try {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith(BASE_PATH)) {
      const [, packageName] = pathname.split(BASE_PATH);

      if (packageName) {
        const baseURL = `${NPM_PROVIDER_URL}${packageName}`;
        const filesToFetch = ["package.json", ...maybeReadmeFiles];

        const [jspmPackage, README, readme] = await Promise.all(
          filesToFetch.map((file) =>
            fetch(
              `${baseURL}/${file}`,
            )
          ),
        );

        const {
          name,
          description,
          keywords,
          version,
          homepage,
          license,
          files,
          exports,
        } = await jspmPackage.json();

        const readmeFileContent = await [README, readme].find((readmeFile) =>
          readmeFile.status === 200 || readmeFile.status === 304
        ).text();

        const readmeHTML = marked.parse(readmeFileContent);

        const app = renderSSR(
          jsx
            `<${Package} name=${name} description=${description} version=${version} homepage=${homepage} license=${license} files=${files} exports=${exports} readme=${readmeHTML} keywords=${keywords} />`,
        );

        const { body, head, footer } = Helmet.SSR(app);

        const css = `
      jspm-package-name, jspm-package-version, jspm-package-description, jspm-package-license, jspm-package-file{
          display: block;
      }
    `;

        const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${name}@${version} - JSPM</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content=${description}>
        <style>
          ${css}
        </style>
        ${head.join("\n")}
      </head>
      <body>
        ${body}
        ${footer.join("\n")}
      </body>
    </html>`;

        return new Response(html, {
          headers,
        });
      }
    }

    return new Response("404", { status: 404 });
  } catch (error) {
    return new Response(error.message || error.toString(), { status: 500 });
  }
}

export { requestHandler };
