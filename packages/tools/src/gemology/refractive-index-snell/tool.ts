import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned, mean } from "../shared.js";
export type Input = Readonly<{
  readonly incidentMediumIndex: number;
  readonly measuredIncidenceDegrees: readonly number[];
  readonly measuredRefractionDegrees: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredSampleRefractiveIndices: readonly number[];
  readonly meanInferredRefractiveIndex: number;
}>;
const inputFields = [
  { id: "incidentMediumIndex", label: "Incident medium index", kind: "number" },
  {
    id: "measuredIncidenceDegrees",
    label: "Measured incidence degrees",
    kind: "numberList",
  },
  {
    id: "measuredRefractionDegrees",
    label: "Measured refraction degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.incidentMediumIndex, "incidentMediumIndex");
  input.measuredIncidenceDegrees.forEach((v) =>
    positive(v, "measuredIncidenceDegrees"),
  );
  input.measuredRefractionDegrees.forEach((v) =>
    positive(v, "measuredRefractionDegrees"),
  );
  aligned(
    input.measuredIncidenceDegrees,
    input.measuredRefractionDegrees,
    "measuredIncidenceDegrees",
  );
  if (
    input.measuredIncidenceDegrees.some((v) => v >= 90) ||
    input.measuredRefractionDegrees.some((v) => v >= 90)
  )
    simpleError(
      "angles",
      "Nonzero acute measured ray angles from interface normal required.",
    );
  const inferredSampleRefractiveIndices = input.measuredIncidenceDegrees.map(
    (i, j) =>
      (input.incidentMediumIndex * Math.sin((i * Math.PI) / 180)) /
      Math.sin((input.measuredRefractionDegrees[j] * Math.PI) / 180),
  );
  return {
    inferredSampleRefractiveIndices,
    meanInferredRefractiveIndex: mean(inferredSampleRefractiveIndices),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  incidentMediumIndex: 1,
  measuredIncidenceDegrees: [30, 30],
  measuredRefractionDegrees: [30, 30],
} satisfies Input;
export const exampleOutput = {
  inferredSampleRefractiveIndices: [1, 1],
  meanInferredRefractiveIndex: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/refractive-index-snell",
  title: "Refractive Index Snell",
  description:
    "Infer optical index from independent measured refracted rays and incident-medium index; no mineral identity, normal-incidence division or ocean-wave speed/refraction alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredSampleRefractiveIndices",
      label: "Inferred sample refractive indices",
      kind: "numberList",
    },
    {
      id: "meanInferredRefractiveIndex",
      label: "Mean inferred refractive index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      incidentMediumIndex: value.incidentMediumIndex as number,
      measuredIncidenceDegrees:
        value.measuredIncidenceDegrees as readonly number[],
      measuredRefractionDegrees:
        value.measuredRefractionDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
