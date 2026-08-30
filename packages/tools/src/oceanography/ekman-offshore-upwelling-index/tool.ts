import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  norm,
} from "../shared.js";
export type Input = Readonly<{
  readonly eastwardWindStressNPerM2: number;
  readonly northwardWindStressNPerM2: number;
  readonly offshoreUnitNormal: readonly number[];
  readonly waterDensityKgPerM3: number;
  readonly signedCoriolisPerSecond: number;
  readonly coastLengthM: number;
}>;
export type Output = Readonly<{
  readonly signedOffshoreEkmanTransportM2PerSecond: number;
  readonly coastIntegratedOffshoreTransportM3PerSecond: number;
}>;
const inputFields = [
  {
    id: "eastwardWindStressNPerM2",
    label: "Eastward wind stress n per m2",
    kind: "number",
  },
  {
    id: "northwardWindStressNPerM2",
    label: "Northward wind stress n per m2",
    kind: "number",
  },
  {
    id: "offshoreUnitNormal",
    label: "Offshore unit normal",
    kind: "numberList",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "signedCoriolisPerSecond",
    label: "Signed coriolis per second",
    kind: "number",
  },
  { id: "coastLengthM", label: "Coast length m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  nonnegative(input.coastLengthM, "coastLengthM");
  if (
    input.offshoreUnitNormal.length !== 2 ||
    Math.abs(norm(input.offshoreUnitNormal) - 1) > 1e-10 ||
    input.signedCoriolisPerSecond === 0
  )
    simpleError(
      "offshoreUnitNormal",
      "Unit two-component caller offshore normal and nonzero f required.",
    );
  const scale = 1 / (input.waterDensityKgPerM3 * input.signedCoriolisPerSecond),
    signedOffshoreEkmanTransportM2PerSecond =
      scale *
      (input.northwardWindStressNPerM2 * input.offshoreUnitNormal[0] -
        input.eastwardWindStressNPerM2 * input.offshoreUnitNormal[1]);
  return {
    signedOffshoreEkmanTransportM2PerSecond,
    coastIntegratedOffshoreTransportM3PerSecond:
      signedOffshoreEkmanTransportM2PerSecond * input.coastLengthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eastwardWindStressNPerM2: 1,
  northwardWindStressNPerM2: 2,
  offshoreUnitNormal: [1, 0],
  waterDensityKgPerM3: 1000,
  signedCoriolisPerSecond: 0.01,
  coastLengthM: 10,
} satisfies Input;
export const exampleOutput = {
  signedOffshoreEkmanTransportM2PerSecond: 0.2,
  coastIntegratedOffshoreTransportM3PerSecond: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/ekman-offshore-upwelling-index",
  title: "Ekman Offshore Upwelling Index",
  description:
    "Project signed Ekman transport onto an explicitly supplied offshore normal and coast length; no shoreline coordinate construction, latitude conversion or Bakun alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedOffshoreEkmanTransportM2PerSecond",
      label: "Signed offshore ekman transport m2 per second",
      kind: "number",
    },
    {
      id: "coastIntegratedOffshoreTransportM3PerSecond",
      label: "Coast integrated offshore transport m3 per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eastwardWindStressNPerM2: value.eastwardWindStressNPerM2 as number,
      northwardWindStressNPerM2: value.northwardWindStressNPerM2 as number,
      offshoreUnitNormal: value.offshoreUnitNormal as readonly number[],
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      signedCoriolisPerSecond: value.signedCoriolisPerSecond as number,
      coastLengthM: value.coastLengthM as number,
    }),
});
export const run = tool.execute;
export default tool;
