import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly girdleThicknessSamplesMm: readonly number[];
  readonly representedPerimeterLengthsMm: readonly number[];
  readonly referenceGirdleDiameterMm: number;
}>;
export type Output = Readonly<{
  readonly perimeterWeightedGirdleThicknessPercent: number;
  readonly girdleThicknessPercentBounds: readonly number[];
  readonly observedCircumferentialThicknessRangeMm: number;
}>;
const inputFields = [
  {
    id: "girdleThicknessSamplesMm",
    label: "Girdle thickness samples mm",
    kind: "numberList",
  },
  {
    id: "representedPerimeterLengthsMm",
    label: "Represented perimeter lengths mm",
    kind: "numberList",
  },
  {
    id: "referenceGirdleDiameterMm",
    label: "Reference girdle diameter mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedPerimeterLengthsMm.forEach((v) =>
    positive(v, "representedPerimeterLengthsMm"),
  );
  positive(input.referenceGirdleDiameterMm, "referenceGirdleDiameterMm");
  input.girdleThicknessSamplesMm.forEach((v) =>
    nonnegative(v, "girdleThicknessSamplesMm"),
  );
  aligned(
    input.girdleThicknessSamplesMm,
    input.representedPerimeterLengthsMm,
    "girdleThicknessSamplesMm",
  );
  const total = input.representedPerimeterLengthsMm.reduce((a, b) => a + b, 0);
  return {
    perimeterWeightedGirdleThicknessPercent:
      (100 *
        input.girdleThicknessSamplesMm.reduce(
          (s, v, i) => s + (v * input.representedPerimeterLengthsMm[i]) / total,
          0,
        )) /
      input.referenceGirdleDiameterMm,
    girdleThicknessPercentBounds: [
      (100 * minimum(input.girdleThicknessSamplesMm)) /
        input.referenceGirdleDiameterMm,
      (100 * maximum(input.girdleThicknessSamplesMm)) /
        input.referenceGirdleDiameterMm,
    ],
    observedCircumferentialThicknessRangeMm:
      maximum(input.girdleThicknessSamplesMm) -
      minimum(input.girdleThicknessSamplesMm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  girdleThicknessSamplesMm: [0.1, 0.3],
  representedPerimeterLengthsMm: [1, 3],
  referenceGirdleDiameterMm: 10,
} satisfies Input;
export const exampleOutput = {
  perimeterWeightedGirdleThicknessPercent: 2.5,
  girdleThicknessPercentBounds: [1, 3],
  observedCircumferentialThicknessRangeMm: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/girdle-thickness-percentage",
  title: "Girdle Thickness Percentage",
  description:
    "Retain circumferential girdle variation and actual perimeter-weighted thickness relative to caller diameter, rather than one unrepresentative spot percentage or fracture-risk grading.",
  inputs: inputFields,
  outputs: [
    {
      id: "perimeterWeightedGirdleThicknessPercent",
      label: "Perimeter weighted girdle thickness percent",
      kind: "number",
    },
    {
      id: "girdleThicknessPercentBounds",
      label: "Girdle thickness percent bounds",
      kind: "numberList",
    },
    {
      id: "observedCircumferentialThicknessRangeMm",
      label: "Observed circumferential thickness range mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      girdleThicknessSamplesMm:
        value.girdleThicknessSamplesMm as readonly number[],
      representedPerimeterLengthsMm:
        value.representedPerimeterLengthsMm as readonly number[],
      referenceGirdleDiameterMm: value.referenceGirdleDiameterMm as number,
    }),
});
export const run = tool.execute;
export default tool;
