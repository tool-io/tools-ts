import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly olderMoraineAgeYearsBeforePresent: number;
  readonly youngerMoraineAgeYearsBeforePresent: number;
  readonly olderDistanceFromReferenceM: number;
  readonly youngerDistanceFromReferenceM: number;
}>;
export type Output = Readonly<{
  readonly signedMoraineInferredRecessionM: number;
  readonly meanInferredRecessionMYear: number;
}>;
const inputFields = [
  {
    id: "olderMoraineAgeYearsBeforePresent",
    label: "Older moraine age years before present",
    kind: "number",
  },
  {
    id: "youngerMoraineAgeYearsBeforePresent",
    label: "Younger moraine age years before present",
    kind: "number",
  },
  {
    id: "olderDistanceFromReferenceM",
    label: "Older distance from reference m",
    kind: "number",
  },
  {
    id: "youngerDistanceFromReferenceM",
    label: "Younger distance from reference m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.olderMoraineAgeYearsBeforePresent,
    "olderMoraineAgeYearsBeforePresent",
  );
  nonnegative(
    input.youngerMoraineAgeYearsBeforePresent,
    "youngerMoraineAgeYearsBeforePresent",
  );
  const dt =
    input.olderMoraineAgeYearsBeforePresent -
    input.youngerMoraineAgeYearsBeforePresent;
  if (dt <= 0)
    simpleError(
      "chronology",
      "Older dated moraine must have greater age before present.",
    );
  const recession =
    input.olderDistanceFromReferenceM - input.youngerDistanceFromReferenceM;
  return {
    signedMoraineInferredRecessionM: recession,
    meanInferredRecessionMYear: recession / dt,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  olderMoraineAgeYearsBeforePresent: 100,
  youngerMoraineAgeYearsBeforePresent: 50,
  olderDistanceFromReferenceM: 1000,
  youngerDistanceFromReferenceM: 500,
} satisfies Input;
export const exampleOutput = {
  signedMoraineInferredRecessionM: 500,
  meanInferredRecessionMYear: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/moraine-position-recession-rate",
  title: "Moraine Position Recession Rate Calculator",
  description:
    "Infer signed mean historical recession between dated moraine positions with outward-distance convention and decreasing ages-before-present; assumes moraines represent termini, not dating certainty or modern feature motion.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedMoraineInferredRecessionM",
      label: "Signed moraine inferred recession m",
      kind: "number",
    },
    {
      id: "meanInferredRecessionMYear",
      label: "Mean inferred recession m year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      olderMoraineAgeYearsBeforePresent:
        value.olderMoraineAgeYearsBeforePresent as number,
      youngerMoraineAgeYearsBeforePresent:
        value.youngerMoraineAgeYearsBeforePresent as number,
      olderDistanceFromReferenceM: value.olderDistanceFromReferenceM as number,
      youngerDistanceFromReferenceM:
        value.youngerDistanceFromReferenceM as number,
    }),
});
export const run = tool.execute;
export default tool;
