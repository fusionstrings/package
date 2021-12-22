const BASE_PATH = "/package/";
const NPM_PROVIDER_URL = "https://ga.jspm.io/npm:";
const maybeReadmeFiles = ["README.md", "readme.md"];
const headers = {
  "content-type": "text/html; charset=UTF-8",
  "Cache-Control":
    "s-maxage=1500, public, immutable, stale-while-revalidate=1501",
};
export { BASE_PATH, headers, maybeReadmeFiles, NPM_PROVIDER_URL };
