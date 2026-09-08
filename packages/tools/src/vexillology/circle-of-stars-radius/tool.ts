import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly availableDiameter: number;
  readonly starRadialExtent: number;
  readonly callerEdgeMargin: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "availableDiameter", label: "Available diameter", kind: "number" },
  { id: "starRadialExtent", label: "Star radial extent", kind: "number" },
  { id: "callerEdgeMargin", label: "Caller edge margin", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.availableDiameter, "availableDiameter");
  nonnegative(input.starRadialExtent, "starRadialExtent");
  nonnegative(input.callerEdgeMargin, "callerEdgeMargin");
  if (
    input.starRadialExtent + input.callerEdgeMargin >
    input.availableDiameter / 2
  )
    simpleError("fit", "Star plus margin fits diameter.");
  return {
    maximumCenterRingRadius:
      input.availableDiameter / 2 -
      input.starRadialExtent -
      input.callerEdgeMargin,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { availableDiameter: 80, starRadialExtent: 5, callerEdgeMargin: 5 },
  output: { result: { maximumCenterRingRadius: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/circle-of-stars-radius",
  title: "Circle of Stars Ring Radius Calculator",
  description:
    "Maximum ideal center-ring radius allowing actual radial star extent and caller margin; not an EU or other mandated ring.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
