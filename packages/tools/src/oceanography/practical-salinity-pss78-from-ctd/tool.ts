import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pss78 } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedConductivityRatioToC35150: number;
  readonly temperatureIpts68C: number;
  readonly pressureDbar: number;
}>;
export type Output = Readonly<{ readonly practicalSalinityPss78: number }>;
const inputFields = [
  {
    id: "observedConductivityRatioToC35150",
    label: "Observed conductivity ratio to c35150",
    kind: "number",
  },
  { id: "temperatureIpts68C", label: "Temperature ipts68 c", kind: "number" },
  { id: "pressureDbar", label: "Pressure dbar", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    practicalSalinityPss78: pss78(
      input.observedConductivityRatioToC35150,
      input.temperatureIpts68C,
      input.pressureDbar,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConductivityRatioToC35150: 1,
  temperatureIpts68C: 15,
  pressureDbar: 0,
} satisfies Input;
export const exampleOutput = { practicalSalinityPss78: 35 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/practical-salinity-pss78-from-ctd",
  title: "Practical Salinity PSS78 From CTD Converter",
  description:
    "UNESCO PSS78 conductivityR=C(S, t, p)/C(35,15,0), pressure correction,2≤S≤42,−2≤IPTS68t≤35, no low-salinity or conductivity-units ambiguity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "practicalSalinityPss78",
      label: "Practical salinity pss78",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedConductivityRatioToC35150:
        value.observedConductivityRatioToC35150 as number,
      temperatureIpts68C: value.temperatureIpts68C as number,
      pressureDbar: value.pressureDbar as number,
    }),
});
export const run = tool.execute;
export default tool;
