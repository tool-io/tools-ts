import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedBaseSizePoints: number;
  readonly callerSuperscriptSizePercent: number;
  readonly callerSubscriptSizePercent: number;
}>;
export type Output = Readonly<{
  readonly callerScriptSizesPoints: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBaseSizePoints",
    label: "Observed base size points",
    kind: "number",
  },
  {
    id: "callerSuperscriptSizePercent",
    label: "Caller superscript size percent",
    kind: "number",
  },
  {
    id: "callerSubscriptSizePercent",
    label: "Caller subscript size percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedBaseSizePoints, "observedBaseSizePoints");
  positive(input.callerSuperscriptSizePercent, "callerSuperscriptSizePercent");
  positive(input.callerSubscriptSizePercent, "callerSubscriptSizePercent");
  return {
    callerScriptSizesPoints: [
      input.callerSuperscriptSizePercent,
      input.callerSubscriptSizePercent,
    ].map((v) => (input.observedBaseSizePoints * v) / 100),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBaseSizePoints: 12,
  callerSuperscriptSizePercent: 60,
  callerSubscriptSizePercent: 70,
} satisfies Input;
export const exampleOutput = {
  callerScriptSizesPoints: [7.2, 8.4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/superscript-subscript-size-percent-default",
  title: "Superscript/Subscript Default Size Percent",
  description:
    "Two independently specified script-size policies, no fixed default or assumption font superscript feature=scaled ordinary glyph. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerScriptSizesPoints",
      label: "Caller script sizes points",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBaseSizePoints: value.observedBaseSizePoints as number,
      callerSuperscriptSizePercent:
        value.callerSuperscriptSizePercent as number,
      callerSubscriptSizePercent: value.callerSubscriptSizePercent as number,
    }),
});
export const run = tool.execute;
export default tool;
