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
  fraction,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDoorPanelWidthMm: number;
  readonly observedDoorPanelHeightMm: number;
  readonly callerHandleHorizontalFraction: number;
  readonly callerHandleVerticalFraction: number;
  readonly observedHandleCenterXyMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerFractionRuleHandleCenterMm: readonly number[];
  readonly signedActualHandlePlacementDeviationMm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDoorPanelWidthMm",
    label: "Observed door panel width mm",
    kind: "number",
  },
  {
    id: "observedDoorPanelHeightMm",
    label: "Observed door panel height mm",
    kind: "number",
  },
  {
    id: "callerHandleHorizontalFraction",
    label: "Caller handle horizontal fraction",
    kind: "number",
  },
  {
    id: "callerHandleVerticalFraction",
    label: "Caller handle vertical fraction",
    kind: "number",
  },
  {
    id: "observedHandleCenterXyMm",
    label: "Observed handle center xy mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedDoorPanelWidthMm, "observedDoorPanelWidthMm");
  positive(input.observedDoorPanelHeightMm, "observedDoorPanelHeightMm");
  fraction(
    input.callerHandleHorizontalFraction,
    "callerHandleHorizontalFraction",
  );
  fraction(input.callerHandleVerticalFraction, "callerHandleVerticalFraction");
  if (input.observedHandleCenterXyMm.length !== 2)
    simpleError("center", "Actual local handle center XY required.");
  const target = [
    input.observedDoorPanelWidthMm * input.callerHandleHorizontalFraction,
    input.observedDoorPanelHeightMm * input.callerHandleVerticalFraction,
  ];
  return {
    callerFractionRuleHandleCenterMm: target,
    signedActualHandlePlacementDeviationMm: target.map(
      (v, i) => input.observedHandleCenterXyMm[i] - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDoorPanelWidthMm: 100,
  observedDoorPanelHeightMm: 90,
  callerHandleHorizontalFraction: 0.5,
  callerHandleVerticalFraction: 0.3333333333333333,
  observedHandleCenterXyMm: [55, 32],
} satisfies Input;
export const exampleOutput = {
  callerFractionRuleHandleCenterMm: [50, 30],
  signedActualHandlePlacementDeviationMm: [5, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/griff-position-mitte-1-3-regel",
  title: "Griff Position Mitte 1/3 Regel Calculator",
  description:
    "Audit actual handle center against explicit caller fractional placement rule (center/one-third example), not128/192mm two-hole bore pattern or mandatory aesthetic/ergonomic standard. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerFractionRuleHandleCenterMm",
      label: "Caller fraction rule handle center mm",
      kind: "numberList",
    },
    {
      id: "signedActualHandlePlacementDeviationMm",
      label: "Signed actual handle placement deviation mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDoorPanelWidthMm: value.observedDoorPanelWidthMm as number,
      observedDoorPanelHeightMm: value.observedDoorPanelHeightMm as number,
      callerHandleHorizontalFraction:
        value.callerHandleHorizontalFraction as number,
      callerHandleVerticalFraction:
        value.callerHandleVerticalFraction as number,
      observedHandleCenterXyMm:
        value.observedHandleCenterXyMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
