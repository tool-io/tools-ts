import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  range,
} from "../shared.js";
export type Input = Readonly<{
  readonly lineInkLeftEdgesPx: readonly number[];
  readonly lineInkRightEdgesPx: readonly number[];
  readonly declaredColumnEdgesPx: readonly number[];
  readonly callerOpticalEdgeTolerancePx: number;
}>;
export type Output = Readonly<{
  readonly leftOpticalEdgeDeparturesPx: readonly number[];
  readonly rightOpticalEdgeDeparturesPx: readonly number[];
  readonly outsideCallerEdgeToleranceLineIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "lineInkLeftEdgesPx",
    label: "Line ink left edges px",
    kind: "numberList",
  },
  {
    id: "lineInkRightEdgesPx",
    label: "Line ink right edges px",
    kind: "numberList",
  },
  {
    id: "declaredColumnEdgesPx",
    label: "Declared column edges px",
    kind: "numberList",
  },
  {
    id: "callerOpticalEdgeTolerancePx",
    label: "Caller optical edge tolerance px",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerOpticalEdgeTolerancePx,
    "callerOpticalEdgeTolerancePx",
  );
  aligned(
    input.lineInkLeftEdgesPx,
    input.lineInkRightEdgesPx,
    "lineInkLeftEdgesPx",
  );
  range(input.declaredColumnEdgesPx, "column");
  if (input.lineInkLeftEdgesPx.some((v, i) => v > input.lineInkRightEdgesPx[i]))
    simpleError("ink", "Ordered line ink extents required.");
  const l = input.lineInkLeftEdgesPx.map(
      (v) => v - input.declaredColumnEdgesPx[0],
    ),
    r = input.lineInkRightEdgesPx.map(
      (v) => v - input.declaredColumnEdgesPx[1],
    );
  return {
    leftOpticalEdgeDeparturesPx: l,
    rightOpticalEdgeDeparturesPx: r,
    outsideCallerEdgeToleranceLineIndices: l.flatMap((v, i) =>
      Math.max(Math.abs(v), Math.abs(r[i])) > input.callerOpticalEdgeTolerancePx
        ? [i]
        : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lineInkLeftEdgesPx: [-0.5, 0, 1],
  lineInkRightEdgesPx: [101, 100, 99],
  declaredColumnEdgesPx: [0, 100],
  callerOpticalEdgeTolerancePx: 0.5,
} satisfies Input;
export const exampleOutput = {
  leftOpticalEdgeDeparturesPx: [-0.5, 0, 1],
  rightOpticalEdgeDeparturesPx: [1, 0, -1],
  outsideCallerEdgeToleranceLineIndices: [0, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/optical-margin-alignment-checker",
  title: "Optical Margin Alignment Checker",
  description:
    "Audit measured visible ink edges rather than advance boxes against caller optical margins/tolerance, preserving signed overhang versus inset; not automatic optical alignment.",
  inputs: inputFields,
  outputs: [
    {
      id: "leftOpticalEdgeDeparturesPx",
      label: "Left optical edge departures px",
      kind: "numberList",
    },
    {
      id: "rightOpticalEdgeDeparturesPx",
      label: "Right optical edge departures px",
      kind: "numberList",
    },
    {
      id: "outsideCallerEdgeToleranceLineIndices",
      label: "Outside caller edge tolerance line indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      lineInkLeftEdgesPx: value.lineInkLeftEdgesPx as readonly number[],
      lineInkRightEdgesPx: value.lineInkRightEdgesPx as readonly number[],
      declaredColumnEdgesPx: value.declaredColumnEdgesPx as readonly number[],
      callerOpticalEdgeTolerancePx:
        value.callerOpticalEdgeTolerancePx as number,
    }),
});
export const run = tool.execute;
export default tool;
