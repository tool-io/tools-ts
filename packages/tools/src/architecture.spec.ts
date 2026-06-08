import { describe, expect, it } from "vitest";
import manifest from "../package.json" with { type: "json" };

const sourceModules = (
  import.meta as unknown as {
    glob<T>(
      pattern: string,
      options: { eager: true; import: "default"; query: "?raw" },
    ): Record<string, T>;
  }
).glob<string>("./**/*.ts", {
  eager: true,
  import: "default",
  query: "?raw",
});

const sources = new Map(
  Object.entries(sourceModules).filter(
    ([file]) => !file.endsWith(".spec.ts") && !file.endsWith(".test.ts"),
  ),
);

const imports = (source: string): readonly string[] => {
  const specifiers = new Set<string>();
  for (const pattern of [
    /\bfrom\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
  ])
    for (const match of source.matchAll(pattern))
      if (match[1]) specifiers.add(match[1]);
  return [...specifiers];
};

const resolveRelativeImport = (
  from: string,
  specifier: string,
): string | undefined => {
  if (!specifier.startsWith(".")) return undefined;
  const parts = from.split("/").slice(0, -1);
  for (const part of specifier.split("/")) {
    if (part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  const path = parts.join("/").replace(/\.js$/, ".ts");
  return sources.has(path) ? path : undefined;
};

describe("package architecture", () => {
  it("declares the package side-effect free", () => {
    expect(manifest.sideEffects).toBe(false);
  });

  it("keeps portable tools independent of Svelte", () => {
    const violations = [...sources].flatMap(([file, source]) =>
      imports(source)
        .filter(
          (specifier) =>
            specifier === "svelte" ||
            specifier.startsWith("svelte/") ||
            specifier.endsWith(".svelte"),
        )
        .map((specifier) => ({ file, specifier })),
    );
    expect(violations).toEqual([]);
  });

  it("contains no circular source imports", () => {
    const graph = new Map(
      [...sources].map(([file, source]) => [
        file,
        imports(source)
          .map((specifier) => resolveRelativeImport(file, specifier))
          .filter((dependency): dependency is string => dependency !== undefined),
      ]),
    );
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const cycles: string[] = [];
    const visit = (file: string): void => {
      if (visiting.has(file)) {
        cycles.push(file);
        return;
      }
      if (visited.has(file)) return;
      visiting.add(file);
      for (const dependency of graph.get(file) ?? []) visit(dependency);
      visiting.delete(file);
      visited.add(file);
    };
    for (const file of sources.keys()) visit(file);
    expect(cycles).toEqual([]);
  });

  it.each(["./parse/numeric-dataset"])("publishes the %s subpath", (subpath) => {
    expect(manifest.exports).toHaveProperty(subpath);
  });
});
