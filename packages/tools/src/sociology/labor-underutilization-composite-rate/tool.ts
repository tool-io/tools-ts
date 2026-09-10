import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly unemployedCount: number;
  readonly timeRelatedUnderemployedCount: number;
  readonly potentialLaborForceCount: number;
  readonly observedLaborForceCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "unemployedCount", label: "Unemployed count", kind: "number" },
  {
    id: "timeRelatedUnderemployedCount",
    label: "Time related underemployed count",
    kind: "number",
  },
  {
    id: "potentialLaborForceCount",
    label: "Potential labor force count",
    kind: "number",
  },
  {
    id: "observedLaborForceCount",
    label: "Observed labor force count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.unemployedCount,
    input.timeRelatedUnderemployedCount,
    input.potentialLaborForceCount,
  ].forEach((v) => nonnegative(v, "count"));
  positive(input.observedLaborForceCount, "laborforce");
  if (
    input.unemployedCount + input.timeRelatedUnderemployedCount >
    input.observedLaborForceCount
  )
    simpleError("counts", "Nonoverlapping in-force counts within force.");
  return {
    conditionalLu4Percent:
      (100 *
        (input.unemployedCount +
          input.timeRelatedUnderemployedCount +
          input.potentialLaborForceCount)) /
      (input.observedLaborForceCount + input.potentialLaborForceCount),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    unemployedCount: 10,
    timeRelatedUnderemployedCount: 5,
    potentialLaborForceCount: 5,
    observedLaborForceCount: 100,
  },
  output: { result: { conditionalLu4Percent: 19.047619047619047 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/labor-underutilization-composite-rate",
  title: "Composite Labor Underutilization Rate Calculator",
  description:
    "Conditional ILOLU4-style composite using independently defined nonoverlapping unemployment, time-related underemployment, potential-force counts. No automated employment classification or representativeness claim.",
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
