import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly mapDistanceM: number;
  readonly groundDistanceM: number;
  readonly callerScaleFactor: number;
  readonly callerTolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mapDistanceM", label: "Map distance m", kind: "number" },
  { id: "groundDistanceM", label: "Ground distance m", kind: "number" },
  { id: "callerScaleFactor", label: "Caller scale factor", kind: "number" },
  { id: "callerTolerance", label: "Caller tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.mapDistanceM, "map");
  positive(i.groundDistanceM, "ground");
  positive(i.callerScaleFactor, "factor");
  nonnegative(i.callerTolerance, "tolerance");
  return {
    callerReviewFlag:
      Math.abs(i.mapDistanceM / i.groundDistanceM - i.callerScaleFactor) >
      i.callerTolerance,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    mapDistanceM: 100,
    groundDistanceM: 100,
    callerScaleFactor: 1,
    callerTolerance: 0.01,
  },
  output: { result: { callerReviewFlag: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/plane-scale-factor-point-check",
  title: "Geodetic to Plane Scale Factor Point Check",
  description:
    "Compare observed local projected/ground distance ratio with independently established point scale factor; no projection model or geodetic correction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
