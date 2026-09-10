import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedDissolutionEventsByDuration: readonly number[];
  readonly matchedAtRiskUnionYearsByDuration: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedDissolutionEventsByDuration",
    label: "Observed dissolution events by duration",
    kind: "numberList",
  },
  {
    id: "matchedAtRiskUnionYearsByDuration",
    label: "Matched at risk union years by duration",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.observedDissolutionEventsByDuration,
    input.matchedAtRiskUnionYearsByDuration,
    "duration",
  );
  input.observedDissolutionEventsByDuration.forEach((v) =>
    nonnegative(v, "events"),
  );
  input.matchedAtRiskUnionYearsByDuration.forEach((v) =>
    positive(v, "exposure"),
  );
  return {
    observedDurationHazardsPerYear:
      input.observedDissolutionEventsByDuration.map(
        (v, i) => v / input.matchedAtRiskUnionYearsByDuration[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedDissolutionEventsByDuration: [2, 4],
    matchedAtRiskUnionYearsByDuration: [10, 20],
  },
  output: { result: { observedDurationHazardsPerYear: [0.2, 0.2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/marital-dissolution-hazard-duration",
  title: "Marital Dissolution Duration Hazard Calculator",
  description:
    "Actual duration-bin event/exposure hazards with caller independently verified censoring and union definitions. Not an individuals dissolution probability or causal life-cycle model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
