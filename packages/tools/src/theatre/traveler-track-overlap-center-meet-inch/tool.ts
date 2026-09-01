import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly trackClearSpanM: number;
  readonly leftPanelLeadingEdgeReachM: number;
  readonly rightPanelLeadingEdgeReachM: number;
  readonly callerRequiredOverlapM: number;
}>;
export type Output = Readonly<{
  readonly signedCenterOverlapM: number;
  readonly signedOverlapMarginM: number;
  readonly withinCallerOverlapPlan: boolean;
}>;
const inputFields = [
  { id: "trackClearSpanM", label: "Track clear span m", kind: "number" },
  {
    id: "leftPanelLeadingEdgeReachM",
    label: "Left panel leading edge reach m",
    kind: "number",
  },
  {
    id: "rightPanelLeadingEdgeReachM",
    label: "Right panel leading edge reach m",
    kind: "number",
  },
  {
    id: "callerRequiredOverlapM",
    label: "Caller required overlap m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.trackClearSpanM, "trackClearSpanM");
  nonnegative(input.leftPanelLeadingEdgeReachM, "leftPanelLeadingEdgeReachM");
  nonnegative(input.rightPanelLeadingEdgeReachM, "rightPanelLeadingEdgeReachM");
  nonnegative(input.callerRequiredOverlapM, "callerRequiredOverlapM");
  const overlap =
    input.leftPanelLeadingEdgeReachM +
    input.rightPanelLeadingEdgeReachM -
    input.trackClearSpanM;
  return {
    signedCenterOverlapM: overlap,
    signedOverlapMarginM: overlap - input.callerRequiredOverlapM,
    withinCallerOverlapPlan: overlap >= input.callerRequiredOverlapM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  trackClearSpanM: 8,
  leftPanelLeadingEdgeReachM: 4.3,
  rightPanelLeadingEdgeReachM: 4.2,
  callerRequiredOverlapM: 0.4,
} satisfies Input;
export const exampleOutput = {
  signedCenterOverlapM: 0.5,
  signedOverlapMarginM: 0.1,
  withinCallerOverlapPlan: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/traveler-track-overlap-center-meet-inch",
  title: "Traveler Track Overlap Center Meet Inch Calculator",
  description:
    "Reconcile actual opposing traveler-panel edge reach and center gap/overlap; negative overlap is unclosed gap, no motor load, end-stop or universal track overlap allowance.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCenterOverlapM",
      label: "Signed center overlap m",
      kind: "number",
    },
    {
      id: "signedOverlapMarginM",
      label: "Signed overlap margin m",
      kind: "number",
    },
    {
      id: "withinCallerOverlapPlan",
      label: "Within caller overlap plan",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      trackClearSpanM: value.trackClearSpanM as number,
      leftPanelLeadingEdgeReachM: value.leftPanelLeadingEdgeReachM as number,
      rightPanelLeadingEdgeReachM: value.rightPanelLeadingEdgeReachM as number,
      callerRequiredOverlapM: value.callerRequiredOverlapM as number,
    }),
});
export const run = tool.execute;
export default tool;
