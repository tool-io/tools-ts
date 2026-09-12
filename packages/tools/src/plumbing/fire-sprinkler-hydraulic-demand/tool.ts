import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyQualifiedSprinklerDischargesGpm: readonly number[];
  readonly callerApplicableIndependentHoseAllowanceGpm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyQualifiedSprinklerDischargesGpm",
    label: "Actual independently qualified sprinkler discharges gpm",
    kind: "numberList",
  },
  {
    id: "callerApplicableIndependentHoseAllowanceGpm",
    label: "Caller applicable independent hose allowance gpm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyQualifiedSprinklerDischargesGpm.length)
    simpleError(
      "actualIndependentlyQualifiedSprinklerDischargesGpm",
      "Actual nonempty observations.",
    );
  input.actualIndependentlyQualifiedSprinklerDischargesGpm.forEach((v) =>
    nonnegative(v, "actualIndependentlyQualifiedSprinklerDischargesGpm"),
  );
  nonnegative(
    input.callerApplicableIndependentHoseAllowanceGpm,
    "callerApplicableIndependentHoseAllowanceGpm",
  );
  return {
    value:
      sum(input.actualIndependentlyQualifiedSprinklerDischargesGpm) +
      input.callerApplicableIndependentHoseAllowanceGpm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyQualifiedSprinklerDischargesGpm: [10, 20],
    callerApplicableIndependentHoseAllowanceGpm: 5,
  },
  output: { result: { value: 35 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/fire-sprinkler-hydraulic-demand",
  title: "Plumbing Fire Sprinkler Hydraulic Demand Calculator",
  description:
    "Actual already engineer-qualified simultaneous sprinkler discharges plus independent hose allowance demandGPM, no density/area/nodes balance or critical area selection. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
