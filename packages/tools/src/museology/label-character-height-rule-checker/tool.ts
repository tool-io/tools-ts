import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedLabelCharacterHeightMm: number;
  readonly observedReadingDistanceMm: number;
  readonly callerRequiredCharacterAngularHeightDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedLabelCharacterHeightMm",
    label: "Observed label character height mm",
    kind: "number",
  },
  {
    id: "observedReadingDistanceMm",
    label: "Observed reading distance mm",
    kind: "number",
  },
  {
    id: "callerRequiredCharacterAngularHeightDegrees",
    label: "Caller required character angular height degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.observedLabelCharacterHeightMm, "height");
  positive(input.observedReadingDistanceMm, "distance");
  positive(input.callerRequiredCharacterAngularHeightDegrees, "screen");
  const a =
    (2 *
      Math.atan(
        input.observedLabelCharacterHeightMm /
          (2 * input.observedReadingDistanceMm),
      ) *
      180) /
    Math.PI;
  return {
    observedCharacterAngularHeightDegrees: a,
    meetsCallerAngleScreen:
      a >= input.callerRequiredCharacterAngularHeightDegrees,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedLabelCharacterHeightMm: 10,
    observedReadingDistanceMm: 1000,
    callerRequiredCharacterAngularHeightDegrees: 0.5,
  },
  output: {
    result: {
      observedCharacterAngularHeightDegrees: 0.5729530205541489,
      meetsCallerAngleScreen: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/label-character-height-rule-checker",
  title: "Label Reading Distance Character Height Rule Checker",
  description:
    "Actual label angular height2atan(h/2d) under caller independently applicable readability screen. Typography, contrast, language, vision, placement and access remain unresolved; not guarantee legibility.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
