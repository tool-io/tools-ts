import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly referenceEtMmPerDay: readonly number[];
  readonly callerCropCoefficients: readonly number[];
  readonly representedDurationsDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly modelCropEtMmPerDay: readonly number[];
  readonly integratedCropEtMm: number;
}>;
const inputFields = [
  {
    id: "referenceEtMmPerDay",
    label: "Reference et mm per day",
    kind: "numberList",
  },
  {
    id: "callerCropCoefficients",
    label: "Caller crop coefficients",
    kind: "numberList",
  },
  {
    id: "representedDurationsDays",
    label: "Represented durations days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedDurationsDays.forEach((v) =>
    positive(v, "representedDurationsDays"),
  );
  input.referenceEtMmPerDay.forEach((v) =>
    nonnegative(v, "referenceEtMmPerDay"),
  );
  input.callerCropCoefficients.forEach((v) =>
    nonnegative(v, "callerCropCoefficients"),
  );
  aligned(
    input.referenceEtMmPerDay,
    input.callerCropCoefficients,
    "referenceEtMmPerDay",
  );
  aligned(
    input.referenceEtMmPerDay,
    input.representedDurationsDays,
    "referenceEtMmPerDay",
  );
  const modelCropEtMmPerDay = input.referenceEtMmPerDay.map(
    (v, i) => v * input.callerCropCoefficients[i],
  );
  return {
    modelCropEtMmPerDay,
    integratedCropEtMm: modelCropEtMmPerDay.reduce(
      (s, v, i) => s + v * input.representedDurationsDays[i],
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceEtMmPerDay: [2, 4],
  callerCropCoefficients: [0.5, 1.5],
  representedDurationsDays: [1, 2],
} satisfies Input;
export const exampleOutput = {
  modelCropEtMmPerDay: [1, 6],
  integratedCropEtMm: 13,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/crop-evapotranspiration",
  title: "Agriculture Crop Evapotranspiration",
  description:
    "Integrate reference ET×caller crop coefficients across unequal stage durations, keeping modeled daily rates; no mutable crop calendar or universal Kc lookup.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelCropEtMmPerDay",
      label: "Model crop et mm per day",
      kind: "numberList",
    },
    {
      id: "integratedCropEtMm",
      label: "Integrated crop et mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceEtMmPerDay: value.referenceEtMmPerDay as readonly number[],
      callerCropCoefficients: value.callerCropCoefficients as readonly number[],
      representedDurationsDays:
        value.representedDurationsDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
