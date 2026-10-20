import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { simpleError } from "../batch42-shared.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  bounded,
  positive,
  mean,
} from "../batch42-shared.js";
import { randomNormal } from "../../probability/normal-box-muller-sampler/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly mean: number;
  readonly standardDeviation: number;
  readonly lowerZ: number;
  readonly upperZ: number;
}>;
export type Output = ReturnType<typeof calculate>;
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "mean", label: "Mean", kind: "number" },
  { id: "standardDeviation", label: "Standard deviation", kind: "number" },
  { id: "lowerZ", label: "Lower z", kind: "number" },
  { id: "upperZ", label: "Upper z", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context);
  bounded(input.count, "replicates", 1, 64);
  positive(input.standardDeviation, "standard deviation");
  if (input.lowerZ >= input.upperZ)
    simpleError("interval", "Ordered explicit z bounds required.");
  const samples = Array.from({ length: input.count }, () => {
    const z = randomNormal(random);
    if (z === null) simpleError("random", "Imported normal sampler failed.");
    return input.mean + input.standardDeviation * z;
  });
  const inside = samples.map((v) =>
    (v - input.mean) / input.standardDeviation >= input.lowerZ &&
    (v - input.mean) / input.standardDeviation <= input.upperZ
      ? 1
      : 0,
  );
  return {
    result: {
      samples,
      insideFlags: inside,
      observedCoverageFraction: mean(inside),
      declaredLowerZ: input.lowerZ,
      declaredUpperZ: input.upperZ,
    },
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    mean: 0,
    standardDeviation: 1,
    lowerZ: -1.959963984540054,
    upperZ: 1.959963984540054,
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/normal-quantile-coverage-experiment",
  title: "Random Normal Quantile Coverage Experiment Generator",
  description:
    "Generate IID normal samples and observed coverage under caller z-interval bounds using existing normalBoxMuller variates. Does not claim theoretical coverage from observations, a calibrated confidence interval or statistical certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "result",
      label: "Reproducible sample and evidence",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          samples: { type: "array", items: { type: "number" } },
          insideFlags: { type: "array", items: { type: "number" } },
          observedCoverageFraction: { type: "number" },
          declaredLowerZ: { type: "number" },
          declaredUpperZ: { type: "number" },
        },
        required: [
          "samples",
          "insideFlags",
          "observedCoverageFraction",
          "declaredLowerZ",
          "declaredUpperZ",
        ],
      },
    },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
