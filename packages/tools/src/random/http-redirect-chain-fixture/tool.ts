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
  boolean,
  choice,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { httpUrl } from "../m500b-web-json-protocol.js";
import { calculateUrl } from "../../parse/url/tool.js";
import { calculateStatusCategory } from "../../http/status-category/tool.js";
export type HttpRedirectChainFixtureInput = {
  readonly baseUrl: string;
  readonly hops: number;
  readonly statuses: readonly number[];
  readonly styles: readonly ("relative" | "absolute")[];
  readonly loop: boolean;
  readonly seed?: number;
};
export type HttpRedirectChainFixtureOutput = {
  readonly steps: readonly {
    readonly url: string;
    readonly status: number;
    readonly category: string;
    readonly location: string;
    readonly resolved: string;
    readonly host: string;
  }[];
  readonly finalUrl: string;
  readonly stop: "loop" | "terminal";
  readonly terminalStatus: number | null;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    baseUrl: text,
    hops: bounded(1, 16),
    statuses: array({ type: "integer", enum: [301, 302, 303, 307, 308] }, 5, 1),
    styles: array(choice(["relative", "absolute"]), 2, 1),
    loop: boolean,
    seed: generatorSeedSchema,
  },
  ["baseUrl", "hops", "statuses", "styles", "loop"],
);
export const outputSchema = object({
  steps: array(
    object({
      url: text,
      status: bounded(301, 308),
      category: text,
      location: text,
      resolved: text,
      host: text,
    }),
    16,
    1,
  ),
  finalUrl: text,
  stop: choice(["loop", "terminal"]),
  terminalStatus: {
    anyOf: [{ type: "integer", const: 200 }, { type: "null" }],
  },
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is HttpRedirectChainFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateHttpRedirectChainFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HttpRedirectChainFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const base = httpUrl(input.baseUrl, "baseUrl"),
      random = createGeneratorRandom(input.seed, context),
      steps: HttpRedirectChainFixtureOutput["steps"][number][] = [],
      seen = new Set<string>();
    let current = base.origin + "/s0",
      stop: "loop" | "terminal" = "terminal";
    for (let i = 0; i < input.hops; i++) {
      seen.add(current);
      const status = pick(input.statuses, random),
        style = pick(input.styles, random),
        path = "/s" + (input.loop && i === input.hops - 1 ? 0 : i + 1),
        location = style === "absolute" ? base.origin + path : path,
        resolved = httpUrl(location, "baseUrl", current).href;
      steps.push({
        url: current,
        status,
        category: calculateStatusCategory({ statusCode: status }).category,
        location,
        resolved,
        host: calculateUrl({ url: resolved }).host,
      });
      current = resolved;
      if (seen.has(current)) {
        stop = "loop";
        break;
      }
    }
    return toolSuccess({
      steps,
      finalUrl: current,
      stop,
      terminalStatus: stop === "loop" ? null : 200,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const httpRedirectChainFixtureExample = {
  input: {
    baseUrl: "https://example.com/start",
    hops: 2,
    statuses: [302],
    styles: ["relative"],
    loop: false,
    seed: 42,
  },
  output: {
    steps: [
      {
        url: "https://example.com/s0",
        status: 302,
        category: "Redirection",
        location: "/s1",
        resolved: "https://example.com/s1",
        host: "example.com",
      },
      {
        url: "https://example.com/s1",
        status: 302,
        category: "Redirection",
        location: "/s2",
        resolved: "https://example.com/s2",
        host: "example.com",
      },
    ],
    finalUrl: "https://example.com/s2",
    stop: "terminal",
    terminalStatus: 200,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HttpRedirectChainFixtureInput,
  HttpRedirectChainFixtureOutput
>;
export const httpRedirectChainFixtureTool = createModelDefinition<
  HttpRedirectChainFixtureInput,
  HttpRedirectChainFixtureOutput
>({
  id: "random/http-redirect-chain-fixture",
  title: "Random HTTP Redirect Chain Fixture Generator",
  description:
    "Construct bounded relative or absolute synthetic redirect targets, resolving URLs and detecting an explicit loop or terminal response.",
  inputSchema,
  outputSchema,
  execute: calculateHttpRedirectChainFixture,
});
export const runHttpRedirectChainFixture = httpRedirectChainFixtureTool.execute;
export default httpRedirectChainFixtureTool;
