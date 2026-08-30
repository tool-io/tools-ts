import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly riverDischargeM3PerSecond: number;
  readonly estuaryWidthM: number;
  readonly tidalVelocityAmplitudeMPerSecond: number;
  readonly gravityMPerSecondSquared: number;
  readonly relativeOceanRiverDensityDifference: number;
  readonly callerStratificationBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly estuarineRichardsonNumber: number;
  readonly callerMixingRegimeCode: number;
}>;
const inputFields = [
  {
    id: "riverDischargeM3PerSecond",
    label: "River discharge m3 per second",
    kind: "number",
  },
  { id: "estuaryWidthM", label: "Estuary width m", kind: "number" },
  {
    id: "tidalVelocityAmplitudeMPerSecond",
    label: "Tidal velocity amplitude m per second",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "relativeOceanRiverDensityDifference",
    label: "Relative ocean river density difference",
    kind: "number",
  },
  {
    id: "callerStratificationBounds",
    label: "Caller stratification bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.estuaryWidthM, "estuaryWidthM");
  positive(
    input.tidalVelocityAmplitudeMPerSecond,
    "tidalVelocityAmplitudeMPerSecond",
  );
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.callerStratificationBounds.forEach((v) =>
    positive(v, "callerStratificationBounds"),
  );
  nonnegative(input.riverDischargeM3PerSecond, "riverDischargeM3PerSecond");
  nonnegative(
    input.relativeOceanRiverDensityDifference,
    "relativeOceanRiverDensityDifference",
  );
  if (
    input.callerStratificationBounds.length !== 2 ||
    input.callerStratificationBounds[0] >= input.callerStratificationBounds[1]
  )
    simpleError("bounds", "Two increasing caller mixing thresholds required.");
  const estuarineRichardsonNumber =
    (input.gravityMPerSecondSquared *
      input.relativeOceanRiverDensityDifference *
      input.riverDischargeM3PerSecond) /
    (input.estuaryWidthM * input.tidalVelocityAmplitudeMPerSecond ** 3);
  return {
    estuarineRichardsonNumber,
    callerMixingRegimeCode:
      estuarineRichardsonNumber < input.callerStratificationBounds[0]
        ? 0
        : estuarineRichardsonNumber < input.callerStratificationBounds[1]
          ? 1
          : 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  riverDischargeM3PerSecond: 10,
  estuaryWidthM: 10,
  tidalVelocityAmplitudeMPerSecond: 1,
  gravityMPerSecondSquared: 10,
  relativeOceanRiverDensityDifference: 0.01,
  callerStratificationBounds: [0.1, 1],
} satisfies Input;
export const exampleOutput = {
  estuarineRichardsonNumber: 0.1,
  callerMixingRegimeCode: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/estuary-stratification-numeration-classifier",
  title: "Estuary Stratification Numeration Classifier",
  description:
    "Screen river buoyancy versus tidal stirring with an estuarine Richardson-number convention and caller regimes; depth cancels in this convention, not a universal mixing classifier.",
  inputs: inputFields,
  outputs: [
    {
      id: "estuarineRichardsonNumber",
      label: "Estuarine richardson number",
      kind: "number",
    },
    {
      id: "callerMixingRegimeCode",
      label: "Caller mixing regime code",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      riverDischargeM3PerSecond: value.riverDischargeM3PerSecond as number,
      estuaryWidthM: value.estuaryWidthM as number,
      tidalVelocityAmplitudeMPerSecond:
        value.tidalVelocityAmplitudeMPerSecond as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      relativeOceanRiverDensityDifference:
        value.relativeOceanRiverDensityDifference as number,
      callerStratificationBounds:
        value.callerStratificationBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
