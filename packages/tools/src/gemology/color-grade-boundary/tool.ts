import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
  bands,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredColorCoordinate: number;
  readonly callerColorGradeLowerEdges: readonly number[];
  readonly coordinateHalfUncertainty: number;
}>;
export type Output = Readonly<{
  readonly centralCallerColorGradeCode: number;
  readonly compatibleCallerColorGradeCodes: readonly number[];
  readonly gradeBoundaryAmbiguous: boolean;
}>;
const inputFields = [
  {
    id: "measuredColorCoordinate",
    label: "Measured color coordinate",
    kind: "number",
  },
  {
    id: "callerColorGradeLowerEdges",
    label: "Caller color grade lower edges",
    kind: "numberList",
  },
  {
    id: "coordinateHalfUncertainty",
    label: "Coordinate half uncertainty",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.coordinateHalfUncertainty, "coordinateHalfUncertainty");
  ordered(input.callerColorGradeLowerEdges, "gradeEdges");
  const lo = input.measuredColorCoordinate - input.coordinateHalfUncertainty,
    hi = input.measuredColorCoordinate + input.coordinateHalfUncertainty,
    start = bands(input.callerColorGradeLowerEdges, lo),
    end = bands(input.callerColorGradeLowerEdges, hi),
    compatibleCallerColorGradeCodes = Array.from(
      { length: end - start + 1 },
      (_, i) => i + start,
    );
  return {
    centralCallerColorGradeCode: bands(
      input.callerColorGradeLowerEdges,
      input.measuredColorCoordinate,
    ),
    compatibleCallerColorGradeCodes,
    gradeBoundaryAmbiguous: start !== end,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredColorCoordinate: 2,
  callerColorGradeLowerEdges: [0, 1, 3],
  coordinateHalfUncertainty: 1,
} satisfies Input;
export const exampleOutput = {
  centralCallerColorGradeCode: 1,
  compatibleCallerColorGradeCodes: [1, 2],
  gradeBoundaryAmbiguous: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/color-grade-boundary",
  title: "Color Grade Letter Boundary Checker",
  description:
    "Audit caller color-grade coordinate bands with inclusive lower boundaries and measurement uncertainty, retaining multiple compatible codes; no automatic D–Z laboratory grading or interpretation of uncalibrated color coordinates.",
  inputs: inputFields,
  outputs: [
    {
      id: "centralCallerColorGradeCode",
      label: "Central caller color grade code",
      kind: "number",
    },
    {
      id: "compatibleCallerColorGradeCodes",
      label: "Compatible caller color grade codes",
      kind: "numberList",
    },
    {
      id: "gradeBoundaryAmbiguous",
      label: "Grade boundary ambiguous",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredColorCoordinate: value.measuredColorCoordinate as number,
      callerColorGradeLowerEdges:
        value.callerColorGradeLowerEdges as readonly number[],
      coordinateHalfUncertainty: value.coordinateHalfUncertainty as number,
    }),
});
export const run = tool.execute;
export default tool;
