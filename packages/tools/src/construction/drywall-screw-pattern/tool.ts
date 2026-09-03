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
  strictlyIncreasing,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerActualBoardSupportXM: readonly number[];
  readonly boardHeightM: number;
  readonly callerEdgeOffsetM: number;
  readonly callerMaximumScrewSpacingM: number;
}>;
export type Output = Readonly<{
  readonly screwXyCentersM: readonly (readonly number[])[];
  readonly screwCount: number;
}>;
const inputFields = [
  {
    id: "callerActualBoardSupportXM",
    label: "Caller actual board support x m",
    kind: "numberList",
  },
  { id: "boardHeightM", label: "Board height m", kind: "number" },
  { id: "callerEdgeOffsetM", label: "Caller edge offset m", kind: "number" },
  {
    id: "callerMaximumScrewSpacingM",
    label: "Caller maximum screw spacing m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.boardHeightM, "boardHeightM");
  positive(input.callerMaximumScrewSpacingM, "callerMaximumScrewSpacingM");
  input.callerActualBoardSupportXM.forEach((v) =>
    nonnegative(v, "callerActualBoardSupportXM"),
  );
  nonnegative(input.callerEdgeOffsetM, "callerEdgeOffsetM");
  strictlyIncreasing(input.callerActualBoardSupportXM, "supports", 1);
  const span = input.boardHeightM - 2 * input.callerEdgeOffsetM;
  nonnegative(span, "remaining fastener run");
  const intervals =
    span === 0 ? 0 : Math.ceil(span / input.callerMaximumScrewSpacingM);
  if (input.callerActualBoardSupportXM.length * (intervals + 1) > 128)
    simpleError("pattern", "≤128 explicit actual fastener coordinates.");
  const centers = input.callerActualBoardSupportXM.flatMap((x) =>
    Array.from({ length: intervals + 1 }, (_, i) => [
      x,
      input.callerEdgeOffsetM + (intervals ? (i * span) / intervals : 0),
    ]),
  );
  return { screwXyCentersM: centers, screwCount: centers.length };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerActualBoardSupportXM: [0, 1],
  boardHeightM: 2,
  callerEdgeOffsetM: 0.1,
  callerMaximumScrewSpacingM: 0.9,
} satisfies Input;
export const exampleOutput = {
  screwXyCentersM: [
    [0, 0.1],
    [0, 1],
    [0, 1.9],
    [1, 0.1],
    [1, 1],
    [1, 1.9],
  ],
  screwCount: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/drywall-screw-pattern",
  title: "Drywall Screw Pattern Calculator",
  description:
    "Actual support-lineXY screw center grid with caller end offsets/max gap, no generic area-density screw count or installation permission. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "screwXyCentersM", label: "Screw xy centers m", kind: "matrix" },
    { id: "screwCount", label: "Screw count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerActualBoardSupportXM:
        value.callerActualBoardSupportXM as readonly number[],
      boardHeightM: value.boardHeightM as number,
      callerEdgeOffsetM: value.callerEdgeOffsetM as number,
      callerMaximumScrewSpacingM: value.callerMaximumScrewSpacingM as number,
    }),
});
export const run = tool.execute;
export default tool;
