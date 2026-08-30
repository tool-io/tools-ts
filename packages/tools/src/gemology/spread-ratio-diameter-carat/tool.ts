import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly observedDiameterMm: number;
  readonly observedCaratMass: number;
  readonly callerReferenceDiameterMmAtOneCarat: number;
  readonly callerMassScalingExponent: number;
}>;
export type Output = Readonly<{
  readonly referenceModelDiameterMm: number;
  readonly diameterSpreadRelativeToMassModel: number;
  readonly faceUpAreaSpreadRelativeToModel: number;
}>;
const inputFields = [
  { id: "observedDiameterMm", label: "Observed diameter mm", kind: "number" },
  { id: "observedCaratMass", label: "Observed carat mass", kind: "number" },
  {
    id: "callerReferenceDiameterMmAtOneCarat",
    label: "Caller reference diameter mm at one carat",
    kind: "number",
  },
  {
    id: "callerMassScalingExponent",
    label: "Caller mass scaling exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedDiameterMm, "observedDiameterMm");
  positive(input.observedCaratMass, "observedCaratMass");
  positive(
    input.callerReferenceDiameterMmAtOneCarat,
    "callerReferenceDiameterMmAtOneCarat",
  );
  positive(input.callerMassScalingExponent, "callerMassScalingExponent");
  const referenceModelDiameterMm =
      input.callerReferenceDiameterMmAtOneCarat *
      input.observedCaratMass ** input.callerMassScalingExponent,
    r = input.observedDiameterMm / referenceModelDiameterMm;
  return {
    referenceModelDiameterMm,
    diameterSpreadRelativeToMassModel: r,
    faceUpAreaSpreadRelativeToModel: r * r,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDiameterMm: 6,
  observedCaratMass: 1,
  callerReferenceDiameterMmAtOneCarat: 6,
  callerMassScalingExponent: 0.3333333333333333,
} satisfies Input;
export const exampleOutput = {
  referenceModelDiameterMm: 6,
  diameterSpreadRelativeToMassModel: 1,
  faceUpAreaSpreadRelativeToModel: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/spread-ratio-diameter-carat",
  title: "Spread Ratio Diameter-to-Carat",
  description:
    "Compare measured face-up diameter/area to caller independently calibrated mass-scaling reference; no universal ideal diameter, commercial cut grade or assumed same-density mineral.",
  inputs: inputFields,
  outputs: [
    {
      id: "referenceModelDiameterMm",
      label: "Reference model diameter mm",
      kind: "number",
    },
    {
      id: "diameterSpreadRelativeToMassModel",
      label: "Diameter spread relative to mass model",
      kind: "number",
    },
    {
      id: "faceUpAreaSpreadRelativeToModel",
      label: "Face up area spread relative to model",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDiameterMm: value.observedDiameterMm as number,
      observedCaratMass: value.observedCaratMass as number,
      callerReferenceDiameterMmAtOneCarat:
        value.callerReferenceDiameterMmAtOneCarat as number,
      callerMassScalingExponent: value.callerMassScalingExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
