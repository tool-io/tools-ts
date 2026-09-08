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
  rad,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedViewingDistanceMeters: number;
  readonly callerRequiredAngularLetterHeightArcmin: number;
}>;
export type Output = Readonly<{ readonly conditionalLetterHeightMm: number }>;
const inputFields = [
  {
    id: "observedViewingDistanceMeters",
    label: "Observed viewing distance meters",
    kind: "number",
  },
  {
    id: "callerRequiredAngularLetterHeightArcmin",
    label: "Caller required angular letter height arcmin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerRequiredAngularLetterHeightArcmin,
    "callerRequiredAngularLetterHeightArcmin",
  );
  nonnegative(
    input.observedViewingDistanceMeters,
    "observedViewingDistanceMeters",
  );
  if (input.callerRequiredAngularLetterHeightArcmin >= 10800)
    simpleError("angle", "Letterangle<180°.");
  return {
    conditionalLetterHeightMm:
      2 *
      input.observedViewingDistanceMeters *
      1000 *
      Math.tan(rad(input.callerRequiredAngularLetterHeightArcmin / 60) / 2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedViewingDistanceMeters: 10,
  callerRequiredAngularLetterHeightArcmin: 20,
} satisfies Input;
export const exampleOutput = {
  conditionalLetterHeightMm: 58.1778058255804,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/viewing-distance-signage-letter-height",
  title: "Signage Letter Height From Viewing Distance",
  description:
    "Invert caller independently verified angular-letter-height criterion at exact viewing geometry, not universal legibility, sign codes or point size from font ink height. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalLetterHeightMm",
      label: "Conditional letter height mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedViewingDistanceMeters:
        value.observedViewingDistanceMeters as number,
      callerRequiredAngularLetterHeightArcmin:
        value.callerRequiredAngularLetterHeightArcmin as number,
    }),
});
export const run = tool.execute;
export default tool;
