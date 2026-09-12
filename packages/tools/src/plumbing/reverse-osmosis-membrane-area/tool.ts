import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerSpecifiedPermeateVolumePerHour: number;
  readonly callerMatchedIndependentlyVerifiedMembraneFluxVolumePerSquareMeterHour: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerSpecifiedPermeateVolumePerHour",
    label: "Caller specified permeate volume per hour",
    kind: "number",
  },
  {
    id: "callerMatchedIndependentlyVerifiedMembraneFluxVolumePerSquareMeterHour",
    label:
      "Caller matched independently verified membrane flux volume per square meter hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerSpecifiedPermeateVolumePerHour,
    "callerSpecifiedPermeateVolumePerHour",
  );
  positive(
    input.callerMatchedIndependentlyVerifiedMembraneFluxVolumePerSquareMeterHour,
    "callerMatchedIndependentlyVerifiedMembraneFluxVolumePerSquareMeterHour",
  );
  return {
    value:
      input.callerSpecifiedPermeateVolumePerHour /
      input.callerMatchedIndependentlyVerifiedMembraneFluxVolumePerSquareMeterHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerSpecifiedPermeateVolumePerHour: 10,
    callerMatchedIndependentlyVerifiedMembraneFluxVolumePerSquareMeterHour: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/reverse-osmosis-membrane-area",
  title: "Plumbing Reverse Osmosis Membrane Area Calculator",
  description:
    "Conditional ROmembraneareaactualpermeateQ/independently matched flux J, salinity/temperature/pressure/recovery externally validated, no membrane performance invented. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
