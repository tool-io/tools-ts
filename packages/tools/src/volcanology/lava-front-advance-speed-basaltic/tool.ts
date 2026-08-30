import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly suppliedBulkDischargeM3PerSecond: number;
  readonly sideAndStorageLossFraction: number;
  readonly frontWidthM: number;
  readonly frontThicknessM: number;
  readonly crossSectionShapeFraction: number;
}>;
export type Output = Readonly<{ readonly modelFrontAdvanceMPerSecond: number }>;
const inputFields = [
  {
    id: "suppliedBulkDischargeM3PerSecond",
    label: "Supplied bulk discharge m3 per second",
    kind: "number",
  },
  {
    id: "sideAndStorageLossFraction",
    label: "Side and storage loss fraction",
    kind: "number",
  },
  { id: "frontWidthM", label: "Front width m", kind: "number" },
  { id: "frontThicknessM", label: "Front thickness m", kind: "number" },
  {
    id: "crossSectionShapeFraction",
    label: "Cross section shape fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.frontWidthM, "frontWidthM");
  positive(input.frontThicknessM, "frontThicknessM");
  positive(input.crossSectionShapeFraction, "crossSectionShapeFraction");
  nonnegative(
    input.suppliedBulkDischargeM3PerSecond,
    "suppliedBulkDischargeM3PerSecond",
  );
  fraction(input.sideAndStorageLossFraction, "sideAndStorageLossFraction");
  fraction(input.crossSectionShapeFraction, "crossSectionShapeFraction");
  return {
    modelFrontAdvanceMPerSecond:
      (input.suppliedBulkDischargeM3PerSecond *
        (1 - input.sideAndStorageLossFraction)) /
      (input.frontWidthM *
        input.frontThicknessM *
        input.crossSectionShapeFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  suppliedBulkDischargeM3PerSecond: 10,
  sideAndStorageLossFraction: 0.2,
  frontWidthM: 4,
  frontThicknessM: 2,
  crossSectionShapeFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  modelFrontAdvanceMPerSecond: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/lava-front-advance-speed-basaltic",
  title: "Lava Front Advance Speed Basaltic",
  description:
    "Invert a bulk volume budget to front advance with caller section shape and diverted/storage fraction; excludes cooling, changing morphology and topographic branching, not a lava arrival forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelFrontAdvanceMPerSecond",
      label: "Model front advance m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      suppliedBulkDischargeM3PerSecond:
        value.suppliedBulkDischargeM3PerSecond as number,
      sideAndStorageLossFraction: value.sideAndStorageLossFraction as number,
      frontWidthM: value.frontWidthM as number,
      frontThicknessM: value.frontThicknessM as number,
      crossSectionShapeFraction: value.crossSectionShapeFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
