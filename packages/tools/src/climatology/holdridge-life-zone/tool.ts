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
  mean,
  polygonClasses,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly monthlyTemperatureC: readonly number[];
  readonly annualPrecipitationMm: number;
  readonly callerVerifiedZoneIds: readonly string[];
  readonly callerLog2BioTemperatureLog2PrecipitationPolygons: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly clippedMonthlyBiotemperatureC: number;
  readonly holdridgePotentialEvaporationRatio: number;
  readonly compatibleCallerZoneIds: readonly string[];
}>;
const inputFields = [
  {
    id: "monthlyTemperatureC",
    label: "Monthly temperature c",
    kind: "numberList",
  },
  {
    id: "annualPrecipitationMm",
    label: "Annual precipitation mm",
    kind: "number",
  },
  {
    id: "callerVerifiedZoneIds",
    label: "Caller verified zone ids",
    kind: "stringList",
  },
  {
    id: "callerLog2BioTemperatureLog2PrecipitationPolygons",
    label: "Caller log2 bio temperature log2 precipitation polygons",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.annualPrecipitationMm, "annualPrecipitationMm");
  if (input.monthlyTemperatureC.length !== 12)
    simpleError("months", "Twelvemonthlytemperaturenormals.");
  const bio = mean(
    input.monthlyTemperatureC.map((v) => (v > 0 && v < 30 ? v : 0)),
  );
  positive(bio, "positivebiotemperature");
  return {
    clippedMonthlyBiotemperatureC: bio,
    holdridgePotentialEvaporationRatio:
      (58.93 * bio) / input.annualPrecipitationMm,
    compatibleCallerZoneIds: polygonClasses(
      Math.log2(bio),
      Math.log2(input.annualPrecipitationMm),
      input.callerVerifiedZoneIds,
      input.callerLog2BioTemperatureLog2PrecipitationPolygons,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyTemperatureC: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
  annualPrecipitationMm: 1000,
  callerVerifiedZoneIds: ["zone-a"],
  callerLog2BioTemperatureLog2PrecipitationPolygons: [
    [0, 4, 9],
    [0, 5, 9],
    [0, 5, 11],
    [0, 4, 11],
  ],
} satisfies Input;
export const exampleOutput = {
  clippedMonthlyBiotemperatureC: 20,
  holdridgePotentialEvaporationRatio: 1.1786,
  compatibleCallerZoneIds: ["zone-a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/holdridge-life-zone",
  title: "Holdridge Life Zone Classifier",
  description:
    "Holdridge biotemperature monthly 0 outside 0<T<30°C, PET=58.93 Tb; query caller independently verified life zone polygons in log 2 Tb/log 2 Pspace, not fake universal zone table. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
  inputs: inputFields,
  outputs: [
    {
      id: "clippedMonthlyBiotemperatureC",
      label: "Clipped monthly biotemperature c",
      kind: "number",
    },
    {
      id: "holdridgePotentialEvaporationRatio",
      label: "Holdridge potential evaporation ratio",
      kind: "number",
    },
    {
      id: "compatibleCallerZoneIds",
      label: "Compatible caller zone ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyTemperatureC: value.monthlyTemperatureC as readonly number[],
      annualPrecipitationMm: value.annualPrecipitationMm as number,
      callerVerifiedZoneIds: value.callerVerifiedZoneIds as readonly string[],
      callerLog2BioTemperatureLog2PrecipitationPolygons:
        value.callerLog2BioTemperatureLog2PrecipitationPolygons as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
