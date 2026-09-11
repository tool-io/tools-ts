import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedExcavatedRockVolume: number;
  readonly actualObservedMachineHours: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedExcavatedRockVolume",
    label: "Actual qualified excavated rock volume",
    kind: "number",
  },
  {
    id: "actualObservedMachineHours",
    label: "Actual observed machine hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualQualifiedExcavatedRockVolume,
    "actualQualifiedExcavatedRockVolume",
  );
  positive(input.actualObservedMachineHours, "actualObservedMachineHours");
  return {
    value:
      input.actualQualifiedExcavatedRockVolume /
      input.actualObservedMachineHours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedExcavatedRockVolume: 10,
    actualObservedMachineHours: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/excavation-rock-ripper-production",
  title: "Rock Ripper Production Calculator",
  description:
    "Actual rock ripper observed volume/hour production, not manufacturer forecast from rock hardness or blast planning. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
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
