import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  mean,
  variance,
} from "../shared.js";
export type Input = Readonly<{
  readonly samplePhosphorusMgPerKg: readonly number[];
  readonly referencePhosphorusMgPerKg: readonly number[];
  readonly callerMaximumStandardizedDifference: number;
}>;
export type Output = Readonly<{
  readonly referenceMeanMgPerKg: number;
  readonly referenceSampleSdMgPerKg: number;
  readonly sampleStandardizedDifferences: readonly number[];
  readonly aboveCallerAnomalyFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "samplePhosphorusMgPerKg",
    label: "Sample phosphorus mg per kg",
    kind: "numberList",
  },
  {
    id: "referencePhosphorusMgPerKg",
    label: "Reference phosphorus mg per kg",
    kind: "numberList",
  },
  {
    id: "callerMaximumStandardizedDifference",
    label: "Caller maximum standardized difference",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMaximumStandardizedDifference,
    "callerMaximumStandardizedDifference",
  );
  input.samplePhosphorusMgPerKg.forEach((v) =>
    nonnegative(v, "samplePhosphorusMgPerKg"),
  );
  input.referencePhosphorusMgPerKg.forEach((v) =>
    nonnegative(v, "referencePhosphorusMgPerKg"),
  );
  const referenceMeanMgPerKg = mean(input.referencePhosphorusMgPerKg),
    referenceSampleSdMgPerKg = Math.sqrt(
      positive(
        variance(input.referencePhosphorusMgPerKg),
        "referencePhosphorusMgPerKg",
      ),
    ),
    sampleStandardizedDifferences = input.samplePhosphorusMgPerKg.map(
      (v) => (v - referenceMeanMgPerKg) / referenceSampleSdMgPerKg,
    );
  return {
    referenceMeanMgPerKg,
    referenceSampleSdMgPerKg,
    sampleStandardizedDifferences,
    aboveCallerAnomalyFlags: sampleStandardizedDifferences.map((v) =>
      v > input.callerMaximumStandardizedDifference ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  samplePhosphorusMgPerKg: [20, 30],
  referencePhosphorusMgPerKg: [10, 20, 30],
  callerMaximumStandardizedDifference: 1,
} satisfies Input;
export const exampleOutput = {
  referenceMeanMgPerKg: 20,
  referenceSampleSdMgPerKg: 10,
  sampleStandardizedDifferences: [0, 1],
  aboveCallerAnomalyFlags: [0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/phosphorus-soil-test-anomaly",
  title: "Soil Phosphorus Anomaly Test Tool",
  description:
    "Standardize soil phosphorus against caller matched-method reference samples and apply a strict upper anomaly cutoff; anomalies do not independently establish occupation or human origin.",
  inputs: inputFields,
  outputs: [
    {
      id: "referenceMeanMgPerKg",
      label: "Reference mean mg per kg",
      kind: "number",
    },
    {
      id: "referenceSampleSdMgPerKg",
      label: "Reference sample sd mg per kg",
      kind: "number",
    },
    {
      id: "sampleStandardizedDifferences",
      label: "Sample standardized differences",
      kind: "numberList",
    },
    {
      id: "aboveCallerAnomalyFlags",
      label: "Above caller anomaly flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      samplePhosphorusMgPerKg:
        value.samplePhosphorusMgPerKg as readonly number[],
      referencePhosphorusMgPerKg:
        value.referencePhosphorusMgPerKg as readonly number[],
      callerMaximumStandardizedDifference:
        value.callerMaximumStandardizedDifference as number,
    }),
});
export const run = tool.execute;
export default tool;
