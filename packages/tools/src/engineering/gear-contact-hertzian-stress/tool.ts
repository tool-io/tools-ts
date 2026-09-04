import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly tangentialLoadN: number;
  readonly faceWidthM: number;
  readonly pitchDiameterM: number;
  readonly callerElasticContactFactorSqrtPa: number;
  readonly callerGeometryFactor: number;
  readonly callerDynamicLoadFactor: number;
}>;
export type Output = Readonly<{ readonly nominalGearHertzContactPa: number }>;
const inputFields = [
  { id: "tangentialLoadN", label: "Tangential load n", kind: "number" },
  { id: "faceWidthM", label: "Face width m", kind: "number" },
  { id: "pitchDiameterM", label: "Pitch diameter m", kind: "number" },
  {
    id: "callerElasticContactFactorSqrtPa",
    label: "Caller elastic contact factor sqrt pa",
    kind: "number",
  },
  {
    id: "callerGeometryFactor",
    label: "Caller geometry factor",
    kind: "number",
  },
  {
    id: "callerDynamicLoadFactor",
    label: "Caller dynamic load factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.faceWidthM, "faceWidthM");
  positive(input.pitchDiameterM, "pitchDiameterM");
  positive(
    input.callerElasticContactFactorSqrtPa,
    "callerElasticContactFactorSqrtPa",
  );
  positive(input.callerGeometryFactor, "callerGeometryFactor");
  positive(input.callerDynamicLoadFactor, "callerDynamicLoadFactor");
  nonnegative(input.tangentialLoadN, "tangentialLoadN");
  return {
    nominalGearHertzContactPa:
      input.callerElasticContactFactorSqrtPa *
      Math.sqrt(
        (input.tangentialLoadN * input.callerDynamicLoadFactor) /
          (input.faceWidthM *
            input.pitchDiameterM *
            input.callerGeometryFactor),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tangentialLoadN: 10,
  faceWidthM: 2,
  pitchDiameterM: 5,
  callerElasticContactFactorSqrtPa: 3,
  callerGeometryFactor: 0.2,
  callerDynamicLoadFactor: 1,
} satisfies Input;
export const exampleOutput = {
  nominalGearHertzContactPa: 6.708203932499369,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/gear-contact-hertzian-stress",
  title: "Gear Hertzian Contact Stress Calculator",
  description:
    "Caller calibrated gear contact geometry/elastic factor and dynamic load, not generic cylinder contact. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "nominalGearHertzContactPa",
      label: "Nominal gear hertz contact pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      tangentialLoadN: value.tangentialLoadN as number,
      faceWidthM: value.faceWidthM as number,
      pitchDiameterM: value.pitchDiameterM as number,
      callerElasticContactFactorSqrtPa:
        value.callerElasticContactFactorSqrtPa as number,
      callerGeometryFactor: value.callerGeometryFactor as number,
      callerDynamicLoadFactor: value.callerDynamicLoadFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
