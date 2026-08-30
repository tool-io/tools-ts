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
  nonnegative,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly calibrationSalinities: readonly number[];
  readonly calibrationDensitiesKgPerM3: readonly number[];
  readonly referenceSalinity: number;
}>;
export type Output = Readonly<{
  readonly fittedDensityAtReferenceKgPerM3: number;
  readonly estimatedContractionPerSalinity: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  {
    id: "calibrationSalinities",
    label: "Calibration salinities",
    kind: "numberList",
  },
  {
    id: "calibrationDensitiesKgPerM3",
    label: "Calibration densities kg per m3",
    kind: "numberList",
  },
  { id: "referenceSalinity", label: "Reference salinity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.calibrationDensitiesKgPerM3.forEach((v) =>
    positive(v, "calibrationDensitiesKgPerM3"),
  );
  input.calibrationSalinities.forEach((v) =>
    nonnegative(v, "calibrationSalinities"),
  );
  nonnegative(input.referenceSalinity, "referenceSalinity");
  ordered(input.calibrationSalinities, "calibrationSalinities");
  if (
    input.referenceSalinity < input.calibrationSalinities[0] ||
    input.referenceSalinity > input.calibrationSalinities.at(-1)!
  )
    simpleError(
      "referenceSalinity",
      "Reference must lie within fixed-temperature/pressure calibration.",
    );
  const fit = regression(
      input.calibrationSalinities,
      input.calibrationDensitiesKgPerM3,
    ),
    fittedDensityAtReferenceKgPerM3 = positive(
      fit.intercept + fit.slope * input.referenceSalinity,
      "density",
    );
  return {
    fittedDensityAtReferenceKgPerM3,
    estimatedContractionPerSalinity:
      fit.slope / fittedDensityAtReferenceKgPerM3,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calibrationSalinities: [0, 10, 20],
  calibrationDensitiesKgPerM3: [1000, 1008, 1016],
  referenceSalinity: 10,
} satisfies Input;
export const exampleOutput = {
  fittedDensityAtReferenceKgPerM3: 1008,
  estimatedContractionPerSalinity: 0.0007936507936507937,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/haline-contraction-beta-seawater",
  title: "Haline Contraction Beta Seawater",
  description:
    "Infer signed haline contraction from a supplied density/salinity regression at fixed temperature/pressure; thermal expansion uses a different fixed-property bracket experiment.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedDensityAtReferenceKgPerM3",
      label: "Fitted density at reference kg per m3",
      kind: "number",
    },
    {
      id: "estimatedContractionPerSalinity",
      label: "Estimated contraction per salinity",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      calibrationSalinities: value.calibrationSalinities as readonly number[],
      calibrationDensitiesKgPerM3:
        value.calibrationDensitiesKgPerM3 as readonly number[],
      referenceSalinity: value.referenceSalinity as number,
    }),
});
export const run = tool.execute;
export default tool;
