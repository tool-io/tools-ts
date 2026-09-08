import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredUsableDrawerDepthMm: number;
  readonly independentlyMeasuredProtectedObjectStackDepthMm: number;
  readonly callerRequiredHandlingClearanceMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredUsableDrawerDepthMm",
    label: "Independently measured usable drawer depth mm",
    kind: "number",
  },
  {
    id: "independentlyMeasuredProtectedObjectStackDepthMm",
    label: "Independently measured protected object stack depth mm",
    kind: "number",
  },
  {
    id: "callerRequiredHandlingClearanceMm",
    label: "Caller required handling clearance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.independentlyMeasuredUsableDrawerDepthMm,
    input.independentlyMeasuredProtectedObjectStackDepthMm,
    input.callerRequiredHandlingClearanceMm,
  ].forEach((v) => nonnegative(v, "dimension"));
  const d =
    input.independentlyMeasuredUsableDrawerDepthMm -
    input.independentlyMeasuredProtectedObjectStackDepthMm -
    input.callerRequiredHandlingClearanceMm;
  return {
    signedDrawerClearanceMarginMm: d,
    meetsCallerDepthClearance: d >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredUsableDrawerDepthMm: 100,
    independentlyMeasuredProtectedObjectStackDepthMm: 80,
    callerRequiredHandlingClearanceMm: 10,
  },
  output: {
    result: {
      signedDrawerClearanceMarginMm: 10,
      meetsCallerDepthClearance: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/flatfile-drawer-clearance-checker",
  title: "Oversize Flat File Drawer Depth Clearance Checker",
  description:
    "Actual flat-file usable drawer/object-stack depth reconciliation with caller independently required handling clearance; no width/length fit, weight capacity, crushing risk or conservation-safe storage certified.",
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
