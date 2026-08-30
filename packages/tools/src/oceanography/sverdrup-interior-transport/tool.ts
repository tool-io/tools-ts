import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly windStressCurlNPerM3: number;
  readonly waterDensityKgPerM3: number;
  readonly coriolisNorthGradientPerMeterSecond: number;
  readonly interiorStripWidthM: number;
}>;
export type Output = Readonly<{
  readonly northwardTransportPerWidthM2PerSecond: number;
  readonly stripTransportM3PerSecond: number;
}>;
const inputFields = [
  {
    id: "windStressCurlNPerM3",
    label: "Wind stress curl n per m3",
    kind: "number",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "coriolisNorthGradientPerMeterSecond",
    label: "Coriolis north gradient per meter second",
    kind: "number",
  },
  {
    id: "interiorStripWidthM",
    label: "Interior strip width m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  nonnegative(input.interiorStripWidthM, "interiorStripWidthM");
  if (input.coriolisNorthGradientPerMeterSecond === 0)
    simpleError(
      "coriolisNorthGradientPerMeterSecond",
      "Nonzero beta required.",
    );
  const northwardTransportPerWidthM2PerSecond =
    input.windStressCurlNPerM3 /
    (input.waterDensityKgPerM3 * input.coriolisNorthGradientPerMeterSecond);
  return {
    northwardTransportPerWidthM2PerSecond,
    stripTransportM3PerSecond:
      northwardTransportPerWidthM2PerSecond * input.interiorStripWidthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  windStressCurlNPerM3: 0.01,
  waterDensityKgPerM3: 1000,
  coriolisNorthGradientPerMeterSecond: 0.001,
  interiorStripWidthM: 10,
} satisfies Input;
export const exampleOutput = {
  northwardTransportPerWidthM2PerSecond: 0.01,
  stripTransportM3PerSecond: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/sverdrup-interior-transport",
  title: "Sverdrup Interior Transport",
  description:
    "Compute signed Sverdrup interior transport per width and supplied strip transport; assumes steady linear vorticity balance, not a western boundary current or global circulation prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "northwardTransportPerWidthM2PerSecond",
      label: "Northward transport per width m2 per second",
      kind: "number",
    },
    {
      id: "stripTransportM3PerSecond",
      label: "Strip transport m3 per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      windStressCurlNPerM3: value.windStressCurlNPerM3 as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      coriolisNorthGradientPerMeterSecond:
        value.coriolisNorthGradientPerMeterSecond as number,
      interiorStripWidthM: value.interiorStripWidthM as number,
    }),
});
export const run = tool.execute;
export default tool;
