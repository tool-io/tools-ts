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
import { calculateCartesianProduct } from "../../list/cartesian-product/tool.js";
import { runFrequency } from "../../list/frequency/tool.js";
import { coreOutput } from "../m500b-web-json-protocol.js";
export type FeatureFlagStateMatrixInput = {
  readonly flags: readonly string[];
  readonly dependencies: readonly {
    readonly flag: string;
    readonly requires: string;
  }[];
  readonly exclusions: readonly { readonly a: string; readonly b: string }[];
  readonly count: number;
  readonly seed?: number;
};
export type FeatureFlagStateMatrixOutput = {
  readonly feasibleCount: number;
  readonly states: readonly {
    readonly enabled: readonly string[];
    readonly bits: readonly boolean[];
  }[];
  readonly enabledCounts: readonly {
    readonly flag: string;
    readonly count: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    flags: array(label, 8, 1),
    dependencies: array(object({ flag: label, requires: label }), 32),
    exclusions: array(object({ a: label, b: label }), 32),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["flags", "dependencies", "exclusions", "count"],
);
export const outputSchema = object({
  feasibleCount: bounded(0, 256),
  states: array(
    object({ enabled: array(text, 8), bits: array(boolean, 8, 1) }),
    32,
    1,
  ),
  enabledCounts: array(object({ flag: text, count: bounded(0, 32) }), 8),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is FeatureFlagStateMatrixInput =>
  matchesModelInput(input, inputSchema);
export const calculateFeatureFlagStateMatrix = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FeatureFlagStateMatrixOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(input.flags, "flags");
    if (
      input.dependencies.some(
        (d) =>
          !input.flags.includes(d.flag) || !input.flags.includes(d.requires),
      ) ||
      input.exclusions.some(
        (e) => !input.flags.includes(e.a) || !input.flags.includes(e.b),
      )
    )
      simpleError(
        "dependencies",
        "Constraint endpoints must name supplied flags.",
        "unknown_flag",
      );
    let codes = [0];
    for (let i = 0; i < input.flags.length; i++)
      codes = calculateCartesianProduct({
        first: codes,
        second: [0, 1],
      }).pairs.map((pair) => (pair[0] ?? 0) * 2 + (pair[1] ?? 0));
    const all = codes.map((code) => ({
        bits: input.flags.map(
          (_, i) =>
            Math.floor(code / 2 ** (input.flags.length - i - 1)) % 2 === 1,
        ),
        enabled: input.flags.filter(
          (_, i) =>
            Math.floor(code / 2 ** (input.flags.length - i - 1)) % 2 === 1,
        ),
      })),
      feasible = all.filter(
        (s) =>
          input.dependencies.every(
            (d) =>
              !s.enabled.includes(d.flag) || s.enabled.includes(d.requires),
          ) &&
          input.exclusions.every(
            (e) => !s.enabled.includes(e.a) || !s.enabled.includes(e.b),
          ),
      );
    if (input.count > feasible.length)
      simpleError(
        "count",
        "Requested distinct states exceed the exactly enumerated feasible population.",
        "infeasible_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      remaining = [...feasible],
      states: FeatureFlagStateMatrixOutput["states"][number][] = [];
    while (states.length < input.count) {
      const state = pick(remaining, random);
      states.push(state);
      remaining.splice(remaining.indexOf(state), 1);
    }
    const frequencies = coreOutput(
      runFrequency({ values: states.flatMap((s) => s.enabled) }),
    ).frequencies;
    const enabledCounts = input.flags.map((flag) => {
      const count = Object.hasOwn(frequencies, flag) ? frequencies[flag] : 0;
      if (typeof count !== "number")
        throw new Error("Frequency core returned nonnumeric count");
      return { flag, count };
    });
    return toolSuccess({
      feasibleCount: feasible.length,
      states,
      enabledCounts,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const featureFlagStateMatrixExample = {
  input: {
    flags: ["A", "B"],
    dependencies: [{ flag: "A", requires: "B" }],
    exclusions: [],
    count: 2,
    seed: 42,
  },
  output: {
    feasibleCount: 3,
    states: [
      { enabled: ["B"], bits: [false, true] },
      { enabled: [], bits: [false, false] },
    ],
    enabledCounts: [
      { flag: "A", count: 0 },
      { flag: "B", count: 1 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  FeatureFlagStateMatrixInput,
  FeatureFlagStateMatrixOutput
>;
export const featureFlagStateMatrixTool = createModelDefinition<
  FeatureFlagStateMatrixInput,
  FeatureFlagStateMatrixOutput
>({
  id: "random/feature-flag-state-matrix",
  title: "Random Feature Flag State Matrix Generator",
  description:
    "Enumerate bounded supplied Boolean flags under dependencies and exclusions, then sample feasible states without replacement and count enabled frequencies.",
  inputSchema,
  outputSchema,
  execute: calculateFeatureFlagStateMatrix,
});
export const runFeatureFlagStateMatrix = featureFlagStateMatrixTool.execute;
export default featureFlagStateMatrixTool;
