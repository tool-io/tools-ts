import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly totalParagraphLines: number;
  readonly linesBeforePageBreak: number;
  readonly callerMinimumOrphanLines: number;
  readonly callerMinimumWidowLines: number;
}>;
export type Output = Readonly<{
  readonly linesAfterPageBreak: number;
  readonly orphanLimitViolation: boolean;
  readonly widowLimitViolation: boolean;
  readonly breakRespectsCallerPolicy: boolean;
}>;
const inputFields = [
  { id: "totalParagraphLines", label: "Total paragraph lines", kind: "number" },
  {
    id: "linesBeforePageBreak",
    label: "Lines before page break",
    kind: "number",
  },
  {
    id: "callerMinimumOrphanLines",
    label: "Caller minimum orphan lines",
    kind: "number",
  },
  {
    id: "callerMinimumWidowLines",
    label: "Caller minimum widow lines",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.totalParagraphLines, "totalParagraphLines");
  count(input.totalParagraphLines, "totalParagraphLines");
  count(input.linesBeforePageBreak, "linesBeforePageBreak");
  count(input.callerMinimumOrphanLines, "callerMinimumOrphanLines");
  count(input.callerMinimumWidowLines, "callerMinimumWidowLines");
  if (
    input.linesBeforePageBreak < 1 ||
    input.linesBeforePageBreak >= input.totalParagraphLines
  )
    simpleError("break", "An actual interior paragraph page break required.");
  const after = input.totalParagraphLines - input.linesBeforePageBreak,
    o = input.linesBeforePageBreak < input.callerMinimumOrphanLines,
    w = after < input.callerMinimumWidowLines;
  return {
    linesAfterPageBreak: after,
    orphanLimitViolation: o,
    widowLimitViolation: w,
    breakRespectsCallerPolicy: !o && !w,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalParagraphLines: 8,
  linesBeforePageBreak: 2,
  callerMinimumOrphanLines: 3,
  callerMinimumWidowLines: 2,
} satisfies Input;
export const exampleOutput = {
  linesAfterPageBreak: 6,
  orphanLimitViolation: true,
  widowLimitViolation: false,
  breakRespectsCallerPolicy: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/widow-orphan-minimum-lines-rule",
  title: "Widow/Orphan Minimum Lines Rule",
  description:
    "Audit both sides of an actual paragraph break against caller widow/orphan minima; avoids applying page-end labels to unsplit paragraphs, no universal publishing rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "linesAfterPageBreak",
      label: "Lines after page break",
      kind: "number",
    },
    {
      id: "orphanLimitViolation",
      label: "Orphan limit violation",
      kind: "boolean",
    },
    {
      id: "widowLimitViolation",
      label: "Widow limit violation",
      kind: "boolean",
    },
    {
      id: "breakRespectsCallerPolicy",
      label: "Break respects caller policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      totalParagraphLines: value.totalParagraphLines as number,
      linesBeforePageBreak: value.linesBeforePageBreak as number,
      callerMinimumOrphanLines: value.callerMinimumOrphanLines as number,
      callerMinimumWidowLines: value.callerMinimumWidowLines as number,
    }),
});
export const run = tool.execute;
export default tool;
