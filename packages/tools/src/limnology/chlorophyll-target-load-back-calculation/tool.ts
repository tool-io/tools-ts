import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly targetChlorophyllMicrogramsPerLiter: number;
  readonly chlorophyllPowerCoefficient: number;
  readonly chlorophyllPowerExponent: number;
  readonly meanDepthM: number;
  readonly residenceYears: number;
  readonly retentionMultiplier: number;
  readonly retentionExponent: number;
}>;
export type Output = Readonly<{
  readonly impliedTargetPhosphorusMicrogramsPerLiter: number;
  readonly modelArealExternalLoadGramsPerM2Year: number;
}>;
const inputFields = [
  {
    id: "targetChlorophyllMicrogramsPerLiter",
    label: "Target chlorophyll micrograms per liter",
    kind: "number",
  },
  {
    id: "chlorophyllPowerCoefficient",
    label: "Chlorophyll power coefficient",
    kind: "number",
  },
  {
    id: "chlorophyllPowerExponent",
    label: "Chlorophyll power exponent",
    kind: "number",
  },
  { id: "meanDepthM", label: "Mean depth m", kind: "number" },
  { id: "residenceYears", label: "Residence years", kind: "number" },
  { id: "retentionMultiplier", label: "Retention multiplier", kind: "number" },
  { id: "retentionExponent", label: "Retention exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.targetChlorophyllMicrogramsPerLiter,
    "targetChlorophyllMicrogramsPerLiter",
  );
  positive(input.chlorophyllPowerCoefficient, "chlorophyllPowerCoefficient");
  positive(input.chlorophyllPowerExponent, "chlorophyllPowerExponent");
  positive(input.meanDepthM, "meanDepthM");
  positive(input.residenceYears, "residenceYears");
  nonnegative(input.retentionMultiplier, "retentionMultiplier");
  nonnegative(input.retentionExponent, "retentionExponent");
  const impliedTargetPhosphorusMicrogramsPerLiter =
    (input.targetChlorophyllMicrogramsPerLiter /
      input.chlorophyllPowerCoefficient) **
    (1 / input.chlorophyllPowerExponent);
  return {
    impliedTargetPhosphorusMicrogramsPerLiter,
    modelArealExternalLoadGramsPerM2Year:
      (((impliedTargetPhosphorusMicrogramsPerLiter * input.meanDepthM) /
        input.residenceYears) *
        (1 +
          input.retentionMultiplier *
            input.residenceYears ** input.retentionExponent)) /
      1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetChlorophyllMicrogramsPerLiter: 18,
  chlorophyllPowerCoefficient: 2,
  chlorophyllPowerExponent: 2,
  meanDepthM: 5,
  residenceYears: 4,
  retentionMultiplier: 1,
  retentionExponent: 0.5,
} satisfies Input;
export const exampleOutput = {
  impliedTargetPhosphorusMicrogramsPerLiter: 3,
  modelArealExternalLoadGramsPerM2Year: 0.01125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/chlorophyll-target-load-back-calculation",
  title: "Chlorophyll Target Load Back Calculation Tool",
  description:
    "Compose inversion of a supplied chlorophyll/P power calibration with a steady Vollenweider-form loading model; excludes internal loads and does not guarantee a management outcome.",
  inputs: inputFields,
  outputs: [
    {
      id: "impliedTargetPhosphorusMicrogramsPerLiter",
      label: "Implied target phosphorus micrograms per liter",
      kind: "number",
    },
    {
      id: "modelArealExternalLoadGramsPerM2Year",
      label: "Model areal external load grams per m2 year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetChlorophyllMicrogramsPerLiter:
        value.targetChlorophyllMicrogramsPerLiter as number,
      chlorophyllPowerCoefficient: value.chlorophyllPowerCoefficient as number,
      chlorophyllPowerExponent: value.chlorophyllPowerExponent as number,
      meanDepthM: value.meanDepthM as number,
      residenceYears: value.residenceYears as number,
      retentionMultiplier: value.retentionMultiplier as number,
      retentionExponent: value.retentionExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
