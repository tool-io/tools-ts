import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualChangeDetectedTrialCount: number;
  readonly actualChangePresentTrialCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualChangeDetectedTrialCount",
    label: "Actual change detected trial count",
    kind: "number",
  },
  {
    id: "actualChangePresentTrialCount",
    label: "Actual change present trial count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualChangeDetectedTrialCount,
    "actualChangeDetectedTrialCount",
  );
  positive(
    input.actualChangePresentTrialCount,
    "actualChangePresentTrialCount",
  );
  return {
    value:
      (1 * input.actualChangeDetectedTrialCount) /
      input.actualChangePresentTrialCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualChangeDetectedTrialCount: 2,
    actualChangePresentTrialCount: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/change-blindness-hit-rate",
  title: "Change Blindness Hit Rate Calculator",
  description:
    "Actual change blindness hit fraction from independently qualified trials; actual compatible definitions and matching units required, no causal efficacy/diagnosis or safety claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
