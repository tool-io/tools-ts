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
import base from "../../probability/exponential-sampler/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly rate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "rate", label: "Rate", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  sourceFor(input.seed);
  if (context?.random)
    simpleError(
      "random",
      "The imported seed-only distribution accepts a single whole-batch seed, not an injected random source.",
    );
  bounded(input.count, "replicates", 1, 64);
  positive(input.rate, "rate");
  const batch = base.execute({
    rate: input.rate,
    count: input.count,
    seed: input.seed,
  });
  if (!batch.ok)
    simpleError(
      "sampler",
      "Imported exponential batch sampler rejected request.",
    );
  return {
    result: {
      samples: batch.output.samples,
      observedMean: mean(batch.output.samples),
      modelMean: 1 / input.rate,
      samplingConvention: "independent-exponential-rate",
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: { seed: "tool.io/batch42", count: 1, rate: 2 },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/waiting-time-experiment",
  title: "Random Waiting-Time Experiment Generator",
  description:
    "Use the existing seed-only exponential sampler once for the entire IID waiting-time experiment batch, retaining observations and model mean. Explicit seed required; injected sources rejected rather than silently ignored or restarted per sample. Rate/time units reciprocal; no actual service-delay inference.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
