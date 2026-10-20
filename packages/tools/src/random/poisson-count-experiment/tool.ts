import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { simpleError } from "../batch42-shared.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  bounded,
  nonnegative,
  mean,
} from "../batch42-shared.js";
import { randomPoisson } from "../../probability/poisson-sampler/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly rate: number;
}>;
export type Output = ReturnType<typeof calculate>;
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "rate", label: "Rate", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context);
  bounded(input.count, "replicates", 1, 64);
  nonnegative(input.rate, "rate");
  if (input.rate > 1000000)
    simpleError("rate", "Bounded Poisson rate up to1000000.");
  const samples = Array.from({ length: input.count }, () => {
    const v = randomPoisson(input.rate, random);
    if (v === null)
      simpleError(
        "random",
        "Imported Poisson sampler did not converge within source budget.",
      );
    return v;
  });
  return {
    result: {
      samples,
      observedMean: mean(samples),
      modelMean: input.rate,
      modelVariance: input.rate,
    },
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: { seed: "tool.io/batch42", count: 1, rate: 4 },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/poisson-count-experiment",
  title: "Random Poisson Count Experiment Generator",
  description:
    "Generate IID count experiment samples with the existing Poisson variate calculation and explicit model moments. Source calls bounded to100000per request, including degenerate caller randomness. Not a hypothesis-test verdict.",
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
          observedMean: { type: "number" },
          modelMean: { type: "number" },
          modelVariance: { type: "number" },
        },
        required: ["samples", "observedMean", "modelMean", "modelVariance"],
      },
    },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
