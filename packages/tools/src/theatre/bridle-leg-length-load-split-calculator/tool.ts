import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly idealPointLoadNewtons: number;
  readonly leftLegAngleDegreesFromVertical: number;
  readonly rightLegAngleDegreesFromVertical: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "idealPointLoadNewtons",
    label: "Ideal point load newtons",
    kind: "number",
  },
  {
    id: "leftLegAngleDegreesFromVertical",
    label: "Left leg angle degrees from vertical",
    kind: "number",
  },
  {
    id: "rightLegAngleDegreesFromVertical",
    label: "Right leg angle degrees from vertical",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.idealPointLoadNewtons, "force");
  if (
    [
      input.leftLegAngleDegreesFromVertical,
      input.rightLegAngleDegreesFromVertical,
    ].some((v) => v <= 0 || v >= 90)
  )
    simpleError("angles", "Ideal angles strictly0–90from vertical.");
  const a = (input.leftLegAngleDegreesFromVertical * Math.PI) / 180,
    b = (input.rightLegAngleDegreesFromVertical * Math.PI) / 180;
  return {
    conditionalLeftLegTensionNewtons:
      (input.idealPointLoadNewtons * Math.sin(b)) / Math.sin(a + b),
    conditionalRightLegTensionNewtons:
      (input.idealPointLoadNewtons * Math.sin(a)) / Math.sin(a + b),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    idealPointLoadNewtons: 1000,
    leftLegAngleDegreesFromVertical: 30,
    rightLegAngleDegreesFromVertical: 30,
  },
  output: {
    result: {
      conditionalLeftLegTensionNewtons: 577.3502691896258,
      conditionalRightLegTensionNewtons: 577.3502691896258,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/bridle-leg-length-load-split-calculator",
  title: "Bridle Leg Length Load Split Calculator",
  description:
    "Ideal two-leg planar static equilibrium, angles from vertical; no dynamics, hardware, elasticity, capacity or engineered approval. This arithmetic is not a rigging/performer-flying setup or authorization.",
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
