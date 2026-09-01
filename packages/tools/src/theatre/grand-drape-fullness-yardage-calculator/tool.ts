import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  positive,
  nonnegative,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly finishedDrapeSpanM: number;
  readonly callerFullnessRatio: number;
  readonly finishedDropM: number;
  readonly topBottomTotalAllowanceM: number;
  readonly rollWidthM: number;
  readonly perDropSeamWidthLossM: number;
}>;
export type Output = Readonly<{
  readonly requiredFullFabricSpanM: number;
  readonly verticalDropCount: number;
  readonly totalPurchaseLengthM: number;
}>;
const inputFields = [
  { id: "finishedDrapeSpanM", label: "Finished drape span m", kind: "number" },
  { id: "callerFullnessRatio", label: "Caller fullness ratio", kind: "number" },
  { id: "finishedDropM", label: "Finished drop m", kind: "number" },
  {
    id: "topBottomTotalAllowanceM",
    label: "Top bottom total allowance m",
    kind: "number",
  },
  { id: "rollWidthM", label: "Roll width m", kind: "number" },
  {
    id: "perDropSeamWidthLossM",
    label: "Per drop seam width loss m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.finishedDrapeSpanM, "finishedDrapeSpanM");
  positive(input.callerFullnessRatio, "callerFullnessRatio");
  positive(input.finishedDropM, "finishedDropM");
  positive(input.rollWidthM, "rollWidthM");
  nonnegative(input.topBottomTotalAllowanceM, "topBottomTotalAllowanceM");
  nonnegative(input.perDropSeamWidthLossM, "perDropSeamWidthLossM");
  if (
    input.callerFullnessRatio < 1 ||
    input.perDropSeamWidthLossM >= input.rollWidthM
  )
    simpleError(
      "fabric",
      "Fullness ≥1 and positive usable roll width required.",
    );
  const span = input.finishedDrapeSpanM * input.callerFullnessRatio,
    count = integer(
      Math.ceil(span / (input.rollWidthM - input.perDropSeamWidthLossM)),
      "drops",
    );
  return {
    requiredFullFabricSpanM: span,
    verticalDropCount: count,
    totalPurchaseLengthM:
      count * (input.finishedDropM + input.topBottomTotalAllowanceM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  finishedDrapeSpanM: 6,
  callerFullnessRatio: 2,
  finishedDropM: 3,
  topBottomTotalAllowanceM: 0.2,
  rollWidthM: 2,
  perDropSeamWidthLossM: 0,
} satisfies Input;
export const exampleOutput = {
  requiredFullFabricSpanM: 12,
  verticalDropCount: 6,
  totalPurchaseLengthM: 19.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/grand-drape-fullness-yardage-calculator",
  title: "Grand Drape Fullness Yardage Calculator",
  description:
    "Plan actual grand-drape full span and whole vertical roll drops with caller seam/hem allowances; no surplus scrap reuse, pile matching, load rating or universal fullness.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredFullFabricSpanM",
      label: "Required full fabric span m",
      kind: "number",
    },
    { id: "verticalDropCount", label: "Vertical drop count", kind: "number" },
    {
      id: "totalPurchaseLengthM",
      label: "Total purchase length m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      finishedDrapeSpanM: value.finishedDrapeSpanM as number,
      callerFullnessRatio: value.callerFullnessRatio as number,
      finishedDropM: value.finishedDropM as number,
      topBottomTotalAllowanceM: value.topBottomTotalAllowanceM as number,
      rollWidthM: value.rollWidthM as number,
      perDropSeamWidthLossM: value.perDropSeamWidthLossM as number,
    }),
});
export const run = tool.execute;
export default tool;
