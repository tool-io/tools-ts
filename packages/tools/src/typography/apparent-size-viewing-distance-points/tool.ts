import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  deg,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedPrintedLetterHeightPoints: number;
  readonly observedViewingDistanceMeters: number;
}>;
export type Output = Readonly<{ readonly apparentLetterAngleArcmin: number }>;
const inputFields = [
  {
    id: "observedPrintedLetterHeightPoints",
    label: "Observed printed letter height points",
    kind: "number",
  },
  {
    id: "observedViewingDistanceMeters",
    label: "Observed viewing distance meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedViewingDistanceMeters,
    "observedViewingDistanceMeters",
  );
  nonnegative(
    input.observedPrintedLetterHeightPoints,
    "observedPrintedLetterHeightPoints",
  );
  return {
    apparentLetterAngleArcmin:
      deg(
        2 *
          Math.atan(
            (input.observedPrintedLetterHeightPoints * 25.4) /
              72 /
              1000 /
              (2 * input.observedViewingDistanceMeters),
          ),
      ) * 60,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPrintedLetterHeightPoints: 72,
  observedViewingDistanceMeters: 1,
} satisfies Input;
export const exampleOutput = {
  apparentLetterAngleArcmin: 87.31407388416625,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/apparent-size-viewing-distance-points",
  title: "Apparent Size at Viewing Distance Points",
  description:
    "Actual measured printed ink height in Post Script points at exact viewing geometry—not CSS font size or universal sign letter height. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentLetterAngleArcmin",
      label: "Apparent letter angle arcmin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPrintedLetterHeightPoints:
        value.observedPrintedLetterHeightPoints as number,
      observedViewingDistanceMeters:
        value.observedViewingDistanceMeters as number,
    }),
});
export const run = tool.execute;
export default tool;
