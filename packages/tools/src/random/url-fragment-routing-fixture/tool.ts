import { budget as fixtureBudget } from "../m500b-web-json-json.js";
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
import {
  object,
  array,
  text,
  bounded,
  choice,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { httpUrl, coreOutput, encode } from "../m500b-web-json-protocol.js";
import { calculateUrlHash } from "../../web/url-hash/tool.js";
export type UrlFragmentRoutingFixtureInput = {
  readonly baseUrl: string;
  readonly fragments: readonly string[];
  readonly queries: readonly string[];
  readonly modes: readonly ("encoded" | "empty" | "absent")[];
  readonly count: number;
  readonly seed?: number;
};
export type UrlFragmentRoutingFixtureOutput = {
  readonly cases: readonly {
    readonly url: string;
    readonly route: string;
    readonly mode: string;
    readonly hash: string;
    readonly hasDelimiter: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    baseUrl: text,
    fragments: array(text, 16, 1),
    queries: array(text, 16, 1),
    modes: array(choice(["encoded", "empty", "absent"]), 3, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["baseUrl", "fragments", "queries", "modes", "count"],
);
export const outputSchema = object({
  cases: array(
    object({
      url: text,
      route: text,
      mode: text,
      hash: text,
      hasDelimiter: boolean,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is UrlFragmentRoutingFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateUrlFragmentRoutingFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UrlFragmentRoutingFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const base = httpUrl(input.baseUrl, "baseUrl"),
      random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const route = pick(input.fragments, random),
        query = pick(input.queries, random),
        mode = pick(input.modes, random);
      const url =
        base.origin +
        base.pathname +
        (query ? "?q=" + encode(query) : "") +
        (mode === "absent"
          ? ""
          : "#" + (mode === "empty" ? "" : encode(route)));
      return {
        url,
        route,
        mode,
        hash: coreOutput(calculateUrlHash({ url })).hash,
        hasDelimiter: mode !== "absent",
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
export const urlFragmentRoutingFixtureExample = {
  input: {
    baseUrl: "https://example.com/app",
    fragments: ["home", "a b"],
    queries: ["red shoes"],
    modes: ["encoded"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        url: "https://example.com/app?q=red%20shoes#a%20b",
        route: "a b",
        mode: "encoded",
        hash: "#a%20b",
        hasDelimiter: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  UrlFragmentRoutingFixtureInput,
  UrlFragmentRoutingFixtureOutput
>;
export const urlFragmentRoutingFixtureTool = createModelDefinition<
  UrlFragmentRoutingFixtureInput,
  UrlFragmentRoutingFixtureOutput
>({
  id: "random/url-fragment-routing-fixture",
  title: "Random URL Fragment Routing Fixture Generator",
  description:
    "Construct supplied query and fragment combinations with encoded, empty and absent fragment controls and delegated hash expectations.",
  inputSchema,
  outputSchema,
  execute: calculateUrlFragmentRoutingFixture,
});
export const runUrlFragmentRoutingFixture =
  urlFragmentRoutingFixtureTool.execute;
export default urlFragmentRoutingFixtureTool;
