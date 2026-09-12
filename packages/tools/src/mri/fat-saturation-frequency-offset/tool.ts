import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerMeasuredSignedFatRelativeWaterShiftPpm: number;
  readonly callerMatchedNucleusCyclicGyromagneticMHzPerTesla: number;
  readonly actualFieldTesla: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMeasuredSignedFatRelativeWaterShiftPpm",
    label: "Caller measured signed fat relative water shift ppm",
    kind: "number",
  },
  {
    id: "callerMatchedNucleusCyclicGyromagneticMHzPerTesla",
    label: "Caller matched nucleus cyclic gyromagnetic m hz per tesla",
    kind: "number",
  },
  { id: "actualFieldTesla", label: "Actual field tesla", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerMatchedNucleusCyclicGyromagneticMHzPerTesla,
    "callerMatchedNucleusCyclicGyromagneticMHzPerTesla",
  );
  positive(input.actualFieldTesla, "actualFieldTesla");
  return {
    value:
      input.callerMeasuredSignedFatRelativeWaterShiftPpm *
      input.callerMatchedNucleusCyclicGyromagneticMHzPerTesla *
      input.actualFieldTesla,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMeasuredSignedFatRelativeWaterShiftPpm: -3.5,
    callerMatchedNucleusCyclicGyromagneticMHzPerTesla: 42.57747892,
    actualFieldTesla: 2,
  },
  output: { result: { value: -298.04235244 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/fat-saturation-frequency-offset",
  title: "Fat Saturation Frequency Offset Calculator",
  description:
    "Actual fat relative water RFfrequencyoffsetHz=ppm\u00d7gammaMHz/T\u00d7T, signed multi-peak shift external; not choose fat-sat pulse/care protocol or clinical scanner safe-use.",
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
