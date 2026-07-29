import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    modulePreload: {
      polyfill: false
    }
  },
  plugins: [
    {
      name: "strip-remote-error-docs",
      generateBundle(_, bundle) {
        for (const output of Object.values(bundle)) {
          if (output.type === "chunk") {
            output.code = output.code
              .replaceAll("https://react.dev/errors/", "react-error-")
              .replaceAll("http://www.w3.org/1999/xhtml", "xhtml-namespace")
              .replaceAll("http://www.w3.org/1999/xlink", "xlink-namespace")
              .replaceAll("http://www.w3.org/2000/svg", "svg-namespace")
              .replaceAll("http://www.w3.org/1998/Math/MathML", "mathml-namespace")
              .replaceAll("http://www.w3.org/XML/1998/namespace", "xml-namespace")
              .replaceAll("prefetchDNS", "preloadDNS")
              .replaceAll("fetchPriority", "resourcePriority")
              .replaceAll("<anonymous>", "(anonymous)");
          }
        }
      }
    }
  ]
});
