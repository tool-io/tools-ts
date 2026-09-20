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
  bounded,
  choice,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { calculateManifestStartUrlExtractor } from "../../web/manifest-start-url-extractor/tool.js";
import { calculateManifestDisplayValidator } from "../../web/manifest-display-validator/tool.js";
import { coreOutput } from "../m500b-web-json-protocol.js";
export type WebManifestMutationCorpusInput = {
  readonly template: {
    readonly startUrl: string;
    readonly display: string;
    readonly themeColor: string;
    readonly iconSources: readonly string[];
  };
  readonly mutations: readonly (
    | "remove-start"
    | "wrong-start"
    | "invalid-display"
    | "remove-icons"
    | "theme-null"
  )[];
  readonly count: number;
  readonly seed?: number;
};
export type WebManifestMutationCorpusOutput = {
  readonly cases: readonly {
    readonly mutation: string;
    readonly json: string;
    readonly startFound: boolean;
    readonly startValue: string;
    readonly startError: string;
    readonly displayValid: boolean;
    readonly iconsPresent: boolean;
    readonly themeIsString: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    template: object({
      startUrl: text,
      display: text,
      themeColor: text,
      iconSources: array(text, 8),
    }),
    mutations: array(
      choice([
        "remove-start",
        "wrong-start",
        "invalid-display",
        "remove-icons",
        "theme-null",
      ]),
      5,
      1,
    ),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["template", "mutations", "count"],
);
export const outputSchema = object({
  cases: array(
    object({
      mutation: text,
      json: text,
      startFound: boolean,
      startValue: text,
      startError: text,
      displayValid: boolean,
      iconsPresent: boolean,
      themeIsString: boolean,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is WebManifestMutationCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateWebManifestMutationCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WebManifestMutationCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const mutation = pick(input.mutations, random),
          manifest: {
            start_url?: string | number;
            display: string;
            theme_color: string | null;
            icons?: { src: string }[];
          } = {
            start_url: input.template.startUrl,
            display: input.template.display,
            theme_color: input.template.themeColor,
            icons: input.template.iconSources.map((src) => ({ src })),
          };
        if (mutation === "remove-start") delete manifest.start_url;
        else if (mutation === "wrong-start") manifest.start_url = 17;
        else if (mutation === "invalid-display")
          manifest.display = "synthetic-invalid";
        else if (mutation === "remove-icons") delete manifest.icons;
        else manifest.theme_color = null;
        const json = JSON.stringify(manifest),
          start = calculateManifestStartUrlExtractor({ manifest: json });
        return {
          mutation,
          json,
          startFound: start.ok ? start.output.found : false,
          startValue: start.ok ? start.output.value : "",
          startError: start.ok
            ? ""
            : (start.error.issues[0]?.code ?? "invalid_input"),
          displayValid: coreOutput(
            calculateManifestDisplayValidator({ display: manifest.display }),
          ).valid,
          iconsPresent: Object.hasOwn(manifest, "icons"),
          themeIsString: typeof manifest.theme_color === "string",
        };
      });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const webManifestMutationCorpusExample = {
  input: {
    template: {
      startUrl: "/app",
      display: "standalone",
      themeColor: "#123456",
      iconSources: ["/icon.png"],
    },
    mutations: ["remove-start", "invalid-display"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        mutation: "invalid-display",
        json: '{"start_url":"/app","display":"synthetic-invalid","theme_color":"#123456","icons":[{"src":"/icon.png"}]}',
        startFound: true,
        startValue: "/app",
        startError: "",
        displayValid: false,
        iconsPresent: true,
        themeIsString: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  WebManifestMutationCorpusInput,
  WebManifestMutationCorpusOutput
>;
export const webManifestMutationCorpusTool = createModelDefinition<
  WebManifestMutationCorpusInput,
  WebManifestMutationCorpusOutput
>({
  id: "random/web-manifest-mutation-corpus",
  title: "Random Web Manifest Mutation Corpus Generator",
  description:
    "Mutate supplied manifest start URL, display, theme and icon fields and retain delegated parser outcomes plus member-shape labels.",
  inputSchema,
  outputSchema,
  execute: calculateWebManifestMutationCorpus,
});
export const runWebManifestMutationCorpus =
  webManifestMutationCorpusTool.execute;
export default webManifestMutationCorpusTool;
