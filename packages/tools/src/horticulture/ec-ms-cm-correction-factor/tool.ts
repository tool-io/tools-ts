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
  readonly observedEcMsPerCm: readonly number[];
  readonly sampleTemperaturesC: readonly number[];
  readonly referenceTemperatureC: number;
  readonly relativeTemperatureCoefficientsPerDegree: readonly number[];
  readonly instrumentAlreadyTemperatureCompensated: boolean;
}>;
export type Output = Readonly<{
  readonly referenceEcMsPerCm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedEcMsPerCm",
    label: "Observed ec ms per cm",
    kind: "numberList",
  },
  {
    id: "sampleTemperaturesC",
    label: "Sample temperatures c",
    kind: "numberList",
  },
  {
    id: "referenceTemperatureC",
    label: "Reference temperature c",
    kind: "number",
  },
  {
    id: "relativeTemperatureCoefficientsPerDegree",
    label: "Relative temperature coefficients per degree",
    kind: "numberList",
  },
  {
    id: "instrumentAlreadyTemperatureCompensated",
    label: "Instrument already temperature compensated",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedEcMsPerCm.forEach((v) => nonnegative(v, "observedEcMsPerCm"));
  input.relativeTemperatureCoefficientsPerDegree.forEach((v) =>
    nonnegative(v, "relativeTemperatureCoefficientsPerDegree"),
  );
  aligned(
    input.observedEcMsPerCm,
    input.sampleTemperaturesC,
    "observedEcMsPerCm",
  );
  aligned(
    input.observedEcMsPerCm,
    input.relativeTemperatureCoefficientsPerDegree,
    "observedEcMsPerCm",
  );
  return {
    referenceEcMsPerCm: input.observedEcMsPerCm.map((v, i) =>
      input.instrumentAlreadyTemperatureCompensated
        ? v
        : v /
          positive(
            1 +
              input.relativeTemperatureCoefficientsPerDegree[i] *
                (input.sampleTemperaturesC[i] - input.referenceTemperatureC),
            "sampleTemperaturesC",
          ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEcMsPerCm: [2, 3],
  sampleTemperaturesC: [15, 35],
  referenceTemperatureC: 25,
  relativeTemperatureCoefficientsPerDegree: [0.02, 0.02],
  instrumentAlreadyTemperatureCompensated: false,
} satisfies Input;
export const exampleOutput = {
  referenceEcMsPerCm: [2.5, 2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/ec-ms-cm-correction-factor",
  title: "EC MS CM Correction Factor",
  description:
    "Normalize uncompensated solution EC to supplied reference temperature using sample-specific linear coefficients; an already compensated instrument bypass avoids double correction.",
  inputs: inputFields,
  outputs: [
    {
      id: "referenceEcMsPerCm",
      label: "Reference ec ms per cm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEcMsPerCm: value.observedEcMsPerCm as readonly number[],
      sampleTemperaturesC: value.sampleTemperaturesC as readonly number[],
      referenceTemperatureC: value.referenceTemperatureC as number,
      relativeTemperatureCoefficientsPerDegree:
        value.relativeTemperatureCoefficientsPerDegree as readonly number[],
      instrumentAlreadyTemperatureCompensated:
        value.instrumentAlreadyTemperatureCompensated as boolean,
    }),
});
export const run = tool.execute;
export default tool;
