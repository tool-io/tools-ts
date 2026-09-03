import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, normals } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly monthlyTemperatureC: readonly number[];
  readonly monthlyPrecipitationMm: readonly number[];
  readonly callerPrecipitationMmPerTemperatureC: number;
}>;
export type Output = Readonly<{
  readonly monthlySignedThermohydrogramReservesMm: readonly number[];
  readonly observedDryMonthCount: number;
}>;
const inputFields = [
  {
    id: "monthlyTemperatureC",
    label: "Monthly temperature c",
    kind: "numberList",
  },
  {
    id: "monthlyPrecipitationMm",
    label: "Monthly precipitation mm",
    kind: "numberList",
  },
  {
    id: "callerPrecipitationMmPerTemperatureC",
    label: "Caller precipitation mm per temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerPrecipitationMmPerTemperatureC,
    "callerPrecipitationMmPerTemperatureC",
  );
  normals(input.monthlyTemperatureC, input.monthlyPrecipitationMm);
  const r = input.monthlyPrecipitationMm.map(
    (v, i) =>
      v -
      input.callerPrecipitationMmPerTemperatureC *
        Math.max(0, input.monthlyTemperatureC[i]),
  );
  return {
    monthlySignedThermohydrogramReservesMm: r,
    observedDryMonthCount: r.filter((v) => v < 0).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyTemperatureC: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
  monthlyPrecipitationMm: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
  callerPrecipitationMmPerTemperatureC: 2,
} satisfies Input;
export const exampleOutput = {
  monthlySignedThermohydrogramReservesMm: [
    -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20,
  ],
  observedDryMonthCount: 12,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/thermohydrogram-ratio",
  title: "Thermohydrogram Ratio Classifier",
  description:
    "Explicit caller thermohydrogram Pvspositive Tax is ratio and month dryness screen—not Lang annual factor or biological water balance. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
  inputs: inputFields,
  outputs: [
    {
      id: "monthlySignedThermohydrogramReservesMm",
      label: "Monthly signed thermohydrogram reserves mm",
      kind: "numberList",
    },
    {
      id: "observedDryMonthCount",
      label: "Observed dry month count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyTemperatureC: value.monthlyTemperatureC as readonly number[],
      monthlyPrecipitationMm: value.monthlyPrecipitationMm as readonly number[],
      callerPrecipitationMmPerTemperatureC:
        value.callerPrecipitationMmPerTemperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;
