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
  fraction,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly independentOccurrencePositionsM: readonly number[];
  readonly oneSidedConfidence: number;
}>;
export type Output = Readonly<{
  readonly straussSadlerOneSidedExtensionM: number;
  readonly upperTrueRangeEndpointM: number;
}>;
const inputFields = [
  {
    id: "independentOccurrencePositionsM",
    label: "Independent occurrence positions m",
    kind: "numberList",
  },
  { id: "oneSidedConfidence", label: "One sided confidence", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    new Set(input.independentOccurrencePositionsM).size !==
    input.independentOccurrencePositionsM.length
  )
    simpleError(
      "independentOccurrencePositionsM",
      "Distinct independently sampled continuous section positions required; repeated bed counts do not create independent range points.",
    );
  fraction(input.oneSidedConfidence, "oneSidedConfidence");
  if (
    input.oneSidedConfidence <= 0 ||
    input.oneSidedConfidence >= 1 ||
    input.independentOccurrencePositionsM.length < 2
  )
    simpleError(
      "confidence",
      "Confidence in (0,1) and at least two independent occurrences required.",
    );
  const lo = minimum(input.independentOccurrencePositionsM),
    hi = maximum(input.independentOccurrencePositionsM),
    span = positive(hi - lo, "observedRange"),
    alpha = Math.expm1(
      -Math.log1p(-input.oneSidedConfidence) /
        (input.independentOccurrencePositionsM.length - 1),
    ),
    straussSadlerOneSidedExtensionM = span * alpha;
  return {
    straussSadlerOneSidedExtensionM,
    upperTrueRangeEndpointM: hi + straussSadlerOneSidedExtensionM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentOccurrencePositionsM: [0, 5, 10],
  oneSidedConfidence: 0.75,
} satisfies Input;
export const exampleOutput = {
  straussSadlerOneSidedExtensionM: 10,
  upperTrueRangeEndpointM: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/range-confidence-strauss-sadler",
  title: "Confidence Interval on Stratigraphic Range Strauss-Sadler",
  description:
    "Calculate one-sided Strauss–Sadler endpoint extension assuming independent uniform recovery over the true stratigraphic range; not simultaneous two-endpoint coverage or corrected for heterogeneous collecting.",
  inputs: inputFields,
  outputs: [
    {
      id: "straussSadlerOneSidedExtensionM",
      label: "Strauss sadler one sided extension m",
      kind: "number",
    },
    {
      id: "upperTrueRangeEndpointM",
      label: "Upper true range endpoint m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentOccurrencePositionsM:
        value.independentOccurrencePositionsM as readonly number[],
      oneSidedConfidence: value.oneSidedConfidence as number,
    }),
});
export const run = tool.execute;
export default tool;
