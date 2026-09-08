import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredEllipticStainWidth: number;
  readonly independentlyMeasuredEllipticStainLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredEllipticStainWidth",
    label: "Independently measured elliptic stain width",
    kind: "number",
  },
  {
    id: "independentlyMeasuredEllipticStainLength",
    label: "Independently measured elliptic stain length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredEllipticStainLength, "length");
  nonnegative(input.independentlyMeasuredEllipticStainWidth, "width");
  if (
    input.independentlyMeasuredEllipticStainWidth >
    input.independentlyMeasuredEllipticStainLength
  )
    simpleError("ellipse", "Width≤length.");
  return {
    conditionalImpactAngleDegrees:
      (Math.asin(
        input.independentlyMeasuredEllipticStainWidth /
          input.independentlyMeasuredEllipticStainLength,
      ) *
        180) /
      Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredEllipticStainWidth: 1,
    independentlyMeasuredEllipticStainLength: 2,
  },
  output: { result: { conditionalImpactAngleDegrees: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/bloodstain-impact-angle-arcsine-calculator",
  title: "Bloodstain Impact Angle Arcsine Calculator",
  description:
    "Ideal independently measured elliptical stain angle asin(width/length), same units. Restricted planar geometric model, not establish blood identity, origin, direction, crime circumstances or forensic certainty.",
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
