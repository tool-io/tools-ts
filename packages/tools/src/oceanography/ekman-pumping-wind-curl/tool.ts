import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly windStressCurlNPerM3: number;
  readonly eastwardWindStressNPerM2: number;
  readonly signedCoriolisPerSecond: number;
  readonly coriolisNorthGradientPerMeterSecond: number;
  readonly waterDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly verticalEkmanPumpingMPerSecond: number;
}>;
const inputFields = [
  {
    id: "windStressCurlNPerM3",
    label: "Wind stress curl n per m3",
    kind: "number",
  },
  {
    id: "eastwardWindStressNPerM2",
    label: "Eastward wind stress n per m2",
    kind: "number",
  },
  {
    id: "signedCoriolisPerSecond",
    label: "Signed coriolis per second",
    kind: "number",
  },
  {
    id: "coriolisNorthGradientPerMeterSecond",
    label: "Coriolis north gradient per meter second",
    kind: "number",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  if (input.signedCoriolisPerSecond === 0)
    simpleError("signedCoriolisPerSecond", "Nonzero Coriolis required.");
  const f = input.signedCoriolisPerSecond;
  return {
    verticalEkmanPumpingMPerSecond:
      input.windStressCurlNPerM3 / (input.waterDensityKgPerM3 * f) +
      (input.eastwardWindStressNPerM2 *
        input.coriolisNorthGradientPerMeterSecond) /
        (input.waterDensityKgPerM3 * f * f),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  windStressCurlNPerM3: 0.01,
  eastwardWindStressNPerM2: 0.1,
  signedCoriolisPerSecond: 0.01,
  coriolisNorthGradientPerMeterSecond: 0.001,
  waterDensityKgPerM3: 1000,
} satisfies Input;
export const exampleOutput = {
  verticalEkmanPumpingMPerSecond: 0.002,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/ekman-pumping-wind-curl",
  title: "Ekman Pumping Wind Curl",
  description:
    "Compute vertical curl of stress/(rho f), including the supplied beta correction for eastward stress; positive is upward and no coordinate-derived Coriolis values are inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "verticalEkmanPumpingMPerSecond",
      label: "Vertical ekman pumping m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      windStressCurlNPerM3: value.windStressCurlNPerM3 as number,
      eastwardWindStressNPerM2: value.eastwardWindStressNPerM2 as number,
      signedCoriolisPerSecond: value.signedCoriolisPerSecond as number,
      coriolisNorthGradientPerMeterSecond:
        value.coriolisNorthGradientPerMeterSecond as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
