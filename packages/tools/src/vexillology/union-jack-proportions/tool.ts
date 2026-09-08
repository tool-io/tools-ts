import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  simpleError,
  canvas,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly hoist: number;
  readonly fly: number;
  readonly callerVerifiedCentralRedCrossWidthFraction: number;
  readonly callerVerifiedCentralWhiteCrossWidthFraction: number;
  readonly callerVerifiedDiagonalWhiteWidthFraction: number;
  readonly callerVerifiedDiagonalRedWidthFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hoist", label: "Hoist", kind: "number" },
  { id: "fly", label: "Fly", kind: "number" },
  {
    id: "callerVerifiedCentralRedCrossWidthFraction",
    label: "Caller verified central red cross width fraction",
    kind: "number",
  },
  {
    id: "callerVerifiedCentralWhiteCrossWidthFraction",
    label: "Caller verified central white cross width fraction",
    kind: "number",
  },
  {
    id: "callerVerifiedDiagonalWhiteWidthFraction",
    label: "Caller verified diagonal white width fraction",
    kind: "number",
  },
  {
    id: "callerVerifiedDiagonalRedWidthFraction",
    label: "Caller verified diagonal red width fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  canvas(input.fly, input.hoist);
  for (const x of [
    input.callerVerifiedCentralRedCrossWidthFraction,
    input.callerVerifiedCentralWhiteCrossWidthFraction,
    input.callerVerifiedDiagonalWhiteWidthFraction,
    input.callerVerifiedDiagonalRedWidthFraction,
  ])
    fraction(x, "fraction");
  if (
    input.callerVerifiedCentralRedCrossWidthFraction >
      input.callerVerifiedCentralWhiteCrossWidthFraction ||
    input.callerVerifiedDiagonalRedWidthFraction >
      input.callerVerifiedDiagonalWhiteWidthFraction
  )
    simpleError("bands", "Red sub-bands cannot exceed their white envelopes.");
  return {
    centralRedWidth:
      input.hoist * input.callerVerifiedCentralRedCrossWidthFraction,
    centralWhiteWidth:
      input.hoist * input.callerVerifiedCentralWhiteCrossWidthFraction,
    diagonalWhiteWidth:
      input.hoist * input.callerVerifiedDiagonalWhiteWidthFraction,
    diagonalRedWidth:
      input.hoist * input.callerVerifiedDiagonalRedWidthFraction,
    diagonalCenterlineSlope: input.hoist / input.fly,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    hoist: 30,
    fly: 60,
    callerVerifiedCentralRedCrossWidthFraction: 0.2,
    callerVerifiedCentralWhiteCrossWidthFraction: 0.3333333333333333,
    callerVerifiedDiagonalWhiteWidthFraction: 0.2,
    callerVerifiedDiagonalRedWidthFraction: 0.06666666666666667,
  },
  output: {
    result: {
      centralRedWidth: 6,
      centralWhiteWidth: 10,
      diagonalWhiteWidth: 6,
      diagonalRedWidth: 2,
      diagonalCenterlineSlope: 0.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/union-jack-proportions",
  title: "Union Jack Geometry Proportion Solver",
  description:
    "Scale explicit independently verified Union Jack cross/saltire perpendicular widths; reports geometry only, not complete counterchanged offset orientation, clipping, official construction or a generated compliant image.",
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
