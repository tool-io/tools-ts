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
  boolean,
} from "../m500b-web-json-schema.js";
import { pick, distinct } from "../m500b-web-json-json.js";
import { token } from "../m500b-web-json-protocol.js";
import { calculateMethodValidator } from "../../http/method-validator/tool.js";
export type HttpMethodRoutingFixtureInput = {
  readonly routes: readonly {
    readonly path: string;
    readonly methods: readonly string[];
  }[];
  readonly paths: readonly string[];
  readonly methods: readonly string[];
  readonly invalidControl: boolean;
  readonly count: number;
  readonly seed?: number;
};
export type HttpMethodRoutingFixtureOutput = {
  readonly requests: readonly {
    readonly path: string;
    readonly method: string;
    readonly validMethod: boolean;
    readonly decision:
      "allowed" | "unknown-path" | "method-not-allowed" | "invalid-method";
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    routes: array(object({ path: label, methods: array(label, 16) }), 16, 1),
    paths: array(label, 16, 1),
    methods: array(label, 16, 1),
    invalidControl: boolean,
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["routes", "paths", "methods", "invalidControl", "count"],
);
export const outputSchema = object({
  requests: array(
    object({
      path: text,
      method: text,
      validMethod: boolean,
      decision: {
        type: "string",
        enum: [
          "allowed",
          "unknown-path",
          "method-not-allowed",
          "invalid-method",
        ],
      },
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is HttpMethodRoutingFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateHttpMethodRoutingFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HttpMethodRoutingFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(
      input.routes.map((r) => r.path),
      "routes",
    );
    if (
      input.methods.some((m) => !token.test(m)) ||
      input.routes.some((r) => r.methods.some((m) => !token.test(m)))
    )
      simpleError(
        "methods",
        "Methods must be exact RFC tokens.",
        "invalid_method",
      );
    const random = createGeneratorRandom(input.seed, context),
      requests = Array.from(
        { length: input.count },
        (): HttpMethodRoutingFixtureOutput["requests"][number] => {
          const path = pick(input.paths, random),
            method =
              pick(input.methods, random) +
              (input.invalidControl ? " invalid" : ""),
            validMethod = calculateMethodValidator({ method }).valid,
            route = input.routes.find((r) => r.path === path);
          return {
            path,
            method,
            validMethod,
            decision: !validMethod
              ? "invalid-method"
              : !route
                ? "unknown-path"
                : route.methods.includes(method)
                  ? "allowed"
                  : "method-not-allowed",
          };
        },
      );
    return toolSuccess({
      requests,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const httpMethodRoutingFixtureExample = {
  input: {
    routes: [{ path: "/read", methods: ["GET"] }],
    paths: ["/read"],
    methods: ["GET", "POST"],
    invalidControl: false,
    count: 1,
    seed: 42,
  },
  output: {
    requests: [
      { path: "/read", method: "GET", validMethod: true, decision: "allowed" },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HttpMethodRoutingFixtureInput,
  HttpMethodRoutingFixtureOutput
>;
export const httpMethodRoutingFixtureTool = createModelDefinition<
  HttpMethodRoutingFixtureInput,
  HttpMethodRoutingFixtureOutput
>({
  id: "random/http-method-routing-fixture",
  title: "Random HTTP Method Routing Fixture Generator",
  description:
    "Construct supplied path/method requests and retain case-sensitive route permission, unknown-path and malformed-token decisions.",
  inputSchema,
  outputSchema,
  execute: calculateHttpMethodRoutingFixture,
});
export const runHttpMethodRoutingFixture = httpMethodRoutingFixtureTool.execute;
export default httpMethodRoutingFixtureTool;
