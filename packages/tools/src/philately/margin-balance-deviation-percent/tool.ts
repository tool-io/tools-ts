import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly leftMarginMm: number;
  readonly rightMarginMm: number;
  readonly topMarginMm: number;
  readonly bottomMarginMm: number;
}>;
export type Output = Readonly<{
  readonly horizontalSignedBalancePercent: number;
  readonly verticalSignedBalancePercent: number;
}>;
const inputFields = [
  { id: "leftMarginMm", label: "Left margin mm", kind: "number" },
  { id: "rightMarginMm", label: "Right margin mm", kind: "number" },
  { id: "topMarginMm", label: "Top margin mm", kind: "number" },
  { id: "bottomMarginMm", label: "Bottom margin mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.leftMarginMm, "leftMarginMm");
  nonnegative(input.rightMarginMm, "rightMarginMm");
  nonnegative(input.topMarginMm, "topMarginMm");
  nonnegative(input.bottomMarginMm, "bottomMarginMm");
  return {
    horizontalSignedBalancePercent:
      (100 * (input.leftMarginMm - input.rightMarginMm)) /
      positive(input.leftMarginMm + input.rightMarginMm, "horizontal total"),
    verticalSignedBalancePercent:
      (100 * (input.topMarginMm - input.bottomMarginMm)) /
      positive(input.topMarginMm + input.bottomMarginMm, "vertical total"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftMarginMm: 2,
  rightMarginMm: 4,
  topMarginMm: 3,
  bottomMarginMm: 3,
} satisfies Input;
export const exampleOutput = {
  horizontalSignedBalancePercent: -33.3333333333333,
  verticalSignedBalancePercent: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/margin-balance-deviation-percent",
  title: "Margin Width Balance Percent Deviation Calculator",
  description:
    "Report signed margin differences divided by margin totals, not a grading-service centering score. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "horizontalSignedBalancePercent",
      label: "Horizontal signed balance percent",
      kind: "number",
    },
    {
      id: "verticalSignedBalancePercent",
      label: "Vertical signed balance percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      leftMarginMm: value.leftMarginMm as number,
      rightMarginMm: value.rightMarginMm as number,
      topMarginMm: value.topMarginMm as number,
      bottomMarginMm: value.bottomMarginMm as number,
    }),
});
export const run = tool.execute;
export default tool;
