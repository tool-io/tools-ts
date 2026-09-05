import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly saturatedBulkVolumes: readonly number[];
  readonly drainedVolumes: readonly number[];
  readonly independentEvaporationLosses: readonly number[];
}>;
export type Output = Readonly<{ readonly specificYield: number }>;
const inputFields = [
  {
    id: "saturatedBulkVolumes",
    label: "Saturated bulk volumes",
    kind: "numberList",
  },
  { id: "drainedVolumes", label: "Drained volumes", kind: "numberList" },
  {
    id: "independentEvaporationLosses",
    label: "Independent evaporation losses",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.saturatedBulkVolumes.forEach((v) =>
    positive(v, "saturatedBulkVolumes"),
  );
  input.drainedVolumes.forEach((v) => nonnegative(v, "drainedVolumes"));
  input.independentEvaporationLosses.forEach((v) =>
    nonnegative(v, "independentEvaporationLosses"),
  );
  aligned(
    input.saturatedBulkVolumes,
    input.drainedVolumes,
    "saturatedBulkVolumes",
  );
  aligned(
    input.saturatedBulkVolumes,
    input.independentEvaporationLosses,
    "saturatedBulkVolumes",
  );
  const d = input.drainedVolumes.map((v, i) => {
    const net = nonnegative(
      v - input.independentEvaporationLosses[i],
      "drainage",
    );
    if (net > input.saturatedBulkVolumes[i])
      simpleError("volume", "Drainage≤bulk.");
    return net;
  });
  return { specificYield: sum(d) / sum(input.saturatedBulkVolumes) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  saturatedBulkVolumes: [1, 2],
  drainedVolumes: [0.1, 0.4],
  independentEvaporationLosses: [0.01, 0.02],
} satisfies Input;
export const exampleOutput = {
  specificYield: 0.15666666666666665,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/specific-yield-gravity-drainage",
  title: "Geology Specific Yield Gravity Drainage Calculator",
  description:
    "Evaporation-corrected actual gravity drainage experiments, not total porosity or elastic storativity. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [{ id: "specificYield", label: "Specific yield", kind: "number" }],
  calculate: (value) =>
    calculate({
      saturatedBulkVolumes: value.saturatedBulkVolumes as readonly number[],
      drainedVolumes: value.drainedVolumes as readonly number[],
      independentEvaporationLosses:
        value.independentEvaporationLosses as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
