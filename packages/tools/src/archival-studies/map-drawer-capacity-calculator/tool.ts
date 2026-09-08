import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredUsableStackDepthMm: number;
  readonly independentlyMeasuredProtectedSheetThicknessMm: number;
  readonly callerAuthorizedSheetCountCap: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredUsableStackDepthMm",
    label: "Independently measured usable stack depth mm",
    kind: "number",
  },
  {
    id: "independentlyMeasuredProtectedSheetThicknessMm",
    label: "Independently measured protected sheet thickness mm",
    kind: "number",
  },
  {
    id: "callerAuthorizedSheetCountCap",
    label: "Caller authorized sheet count cap",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredUsableStackDepthMm, "depth");
  positive(input.independentlyMeasuredProtectedSheetThicknessMm, "thickness");
  bounded(input.callerAuthorizedSheetCountCap, "cap", 0, 1000000);
  const n = Math.floor(
    input.independentlyMeasuredUsableStackDepthMm /
      input.independentlyMeasuredProtectedSheetThicknessMm,
  );
  return {
    conditionalDepthOnlyWholeSheetCount: n,
    conditionalCombinedSheetCap: Math.min(
      n,
      input.callerAuthorizedSheetCountCap,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredUsableStackDepthMm: 10,
    independentlyMeasuredProtectedSheetThicknessMm: 0.5,
    callerAuthorizedSheetCountCap: 15,
  },
  output: {
    result: {
      conditionalDepthOnlyWholeSheetCount: 20,
      conditionalCombinedSheetCap: 15,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/map-drawer-capacity-calculator",
  title: "Map Cabinet Drawer Capacity Sheets per Drawer Calculator",
  description:
    "Conditional map drawer depth-only sheet count under actual protected-sheet thickness and independently authorized count cap; not load capacity, compressibility, dimensions or recommended archival stacking.",
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
