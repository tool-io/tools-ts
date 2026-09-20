import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  label,
  bounded,
  nullableText,
} from "../m500b-web-json-schema.js";
import { pick, distinct } from "../m500b-web-json-json.js";
import { httpUrl, coreOutput } from "../m500b-web-json-protocol.js";
import { calculateImportmapParser } from "../../web/importmap-parser/tool.js";
export type ImportMapping = {
  readonly specifier: string;
  readonly address: string | null;
};
export type ImportMapResolutionFixtureInput = {
  readonly baseUrl: string;
  readonly imports: readonly ImportMapping[];
  readonly scopes: readonly {
    readonly scope: string;
    readonly imports: readonly ImportMapping[];
  }[];
  readonly specifiers: readonly string[];
  readonly referrers: readonly string[];
  readonly count: number;
  readonly seed?: number;
};
export type ImportMapResolutionFixtureOutput = {
  readonly mapJson: string;
  readonly cases: readonly {
    readonly specifier: string;
    readonly referrer: string;
    readonly normalizedSpecifier: string;
    readonly address: string | null;
    readonly status: "resolved" | "blocked" | "unresolved";
    readonly matchedKey: string;
    readonly scope: string;
  }[];
  readonly randomness: GeneratorReplay;
};
const mapping = object({ specifier: label, address: nullableText });
export const inputSchema = object(
  {
    baseUrl: text,
    imports: array(mapping, 16),
    scopes: array(object({ scope: text, imports: array(mapping, 16) }), 8),
    specifiers: array(label, 16, 1),
    referrers: array(text, 16, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["baseUrl", "imports", "scopes", "specifiers", "referrers", "count"],
);
export const outputSchema = object({
  mapJson: text,
  cases: array(
    object({
      specifier: text,
      referrer: text,
      normalizedSpecifier: text,
      address: nullableText,
      status: { type: "string", enum: ["resolved", "blocked", "unresolved"] },
      matchedKey: text,
      scope: text,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is ImportMapResolutionFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateImportMapResolutionFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ImportMapResolutionFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const base = httpUrl(input.baseUrl, "baseUrl"),
      like = (s: string) => /^(?:\/|\.\.?\/|[a-zA-Z][a-zA-Z0-9+.-]*:)/u.test(s),
      normalize = (entries: readonly ImportMapping[]) => {
        const result = entries.map((e) => ({
          specifier: like(e.specifier)
            ? httpUrl(e.specifier, "imports", base.href).href
            : e.specifier,
          address:
            e.address === null
              ? null
              : httpUrl(e.address, "imports", base.href).href,
        }));
        distinct(
          result.map((e) => e.specifier),
          "imports",
        );
        if (
          result.some(
            (e) =>
              e.specifier.endsWith("/") &&
              e.address !== null &&
              !e.address.endsWith("/"),
          )
        )
          simpleError(
            "imports",
            "Prefix addresses must end in slash.",
            "invalid_prefix",
          );
        return result.sort((a, b) => b.specifier.length - a.specifier.length);
      };
    if (
      (input.imports.length +
        input.scopes.reduce((sum, s) => sum + s.imports.length, 0)) *
        (2 * base.href.length + 128) >
      45000
    )
      simpleError(
        "imports",
        "Normalized mapping expansion exceeds the bounded output budget.",
        "resource_limit",
      );
    const imports = normalize(input.imports),
      scopes = input.scopes
        .map((s) => ({
          scope: httpUrl(s.scope, "scopes", base.href).href,
          imports: normalize(s.imports),
        }))
        .sort((a, b) => b.scope.length - a.scope.length);
    distinct(
      scopes.map((s) => s.scope),
      "scopes",
    );
    const mapJson = JSON.stringify({
      imports: Object.fromEntries(imports.map((e) => [e.specifier, e.address])),
      scopes: Object.fromEntries(
        scopes.map((s) => [
          s.scope,
          Object.fromEntries(s.imports.map((e) => [e.specifier, e.address])),
        ]),
      ),
    });
    coreOutput(calculateImportmapParser({ json: mapJson }));
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from(
        { length: input.count },
        (): ImportMapResolutionFixtureOutput["cases"][number] => {
          const specifier = pick(input.specifiers, random),
            referrer = httpUrl(
              pick(input.referrers, random),
              "referrers",
              base.href,
            ).href,
            normalizedSpecifier = like(specifier)
              ? httpUrl(specifier, "specifiers", referrer).href
              : specifier;
          const maps = [
            ...scopes.filter(
              (s) =>
                referrer === s.scope ||
                (s.scope.endsWith("/") && referrer.startsWith(s.scope)),
            ),
            { scope: "", imports },
          ];
          for (const map of maps) {
            const found = map.imports.find(
              (e) =>
                e.specifier === normalizedSpecifier ||
                (e.specifier.endsWith("/") &&
                  normalizedSpecifier.startsWith(e.specifier)),
            );
            if (!found) continue;
            if (found.address === null)
              return {
                specifier,
                referrer,
                normalizedSpecifier,
                address: null,
                status: "blocked",
                matchedKey: found.specifier,
                scope: map.scope,
              };
            const address =
              found.specifier === normalizedSpecifier
                ? found.address
                : httpUrl(
                    normalizedSpecifier.slice(found.specifier.length),
                    "specifiers",
                    found.address,
                  ).href;
            if (
              found.specifier.endsWith("/") &&
              !address.startsWith(found.address)
            )
              return {
                specifier,
                referrer,
                normalizedSpecifier,
                address: null,
                status: "blocked",
                matchedKey: found.specifier,
                scope: map.scope,
              };
            return {
              specifier,
              referrer,
              normalizedSpecifier,
              address,
              status: "resolved",
              matchedKey: found.specifier,
              scope: map.scope,
            };
          }
          return {
            specifier,
            referrer,
            normalizedSpecifier,
            address: like(specifier) ? normalizedSpecifier : null,
            status: like(specifier) ? "resolved" : "unresolved",
            matchedKey: "",
            scope: "",
          };
        },
      );
    return toolSuccess({
      mapJson,
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const importMapResolutionFixtureExample = {
  input: {
    baseUrl: "https://example.com/",
    imports: [{ specifier: "lib", address: "/lib.js" }],
    scopes: [
      { scope: "/app/", imports: [{ specifier: "lib", address: "/v2.js" }] },
    ],
    specifiers: ["lib"],
    referrers: ["/app/main.js"],
    count: 1,
    seed: 42,
  },
  output: {
    mapJson:
      '{"imports":{"lib":"https://example.com/lib.js"},"scopes":{"https://example.com/app/":{"lib":"https://example.com/v2.js"}}}',
    cases: [
      {
        specifier: "lib",
        referrer: "https://example.com/app/main.js",
        normalizedSpecifier: "lib",
        address: "https://example.com/v2.js",
        status: "resolved",
        matchedKey: "lib",
        scope: "https://example.com/app/",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ImportMapResolutionFixtureInput,
  ImportMapResolutionFixtureOutput
>;
export const importMapResolutionFixtureTool = createModelDefinition<
  ImportMapResolutionFixtureInput,
  ImportMapResolutionFixtureOutput
>({
  id: "random/import-map-resolution-fixture",
  title: "Random Import Map Resolution Fixture Generator",
  description:
    "Resolve constructed requests through one supplied HTTP(S) import map using exact and longest-prefix entries, scoped fallback, null blocking and prefix backtrack checks.",
  inputSchema,
  outputSchema,
  execute: calculateImportMapResolutionFixture,
});
export const runImportMapResolutionFixture =
  importMapResolutionFixtureTool.execute;
export default importMapResolutionFixtureTool;
