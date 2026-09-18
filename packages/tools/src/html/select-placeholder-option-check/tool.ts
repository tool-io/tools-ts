import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  required: boolean;
  multiple: boolean;
  displaySize: number;
  optionValues: readonly string[];
  firstDirectChild: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "required", label: "required", kind: "boolean" },
  { id: "multiple", label: "multiple", kind: "boolean" },
  { id: "displaySize", label: "displaySize", kind: "integer" },
  { id: "optionValues", label: "optionValues", kind: "stringList" },
  { id: "firstDirectChild", label: "firstDirectChild", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.displaySize, 1, 128);
  return H.finish({
    placeholder:
      i.required &&
      !i.multiple &&
      i.displaySize === 1 &&
      i.firstDirectChild &&
      i.optionValues.length > 0 &&
      i.optionValues[0] === "",
  });
};
export const example = {
  input: {
    required: true,
    multiple: false,
    displaySize: 1,
    optionValues: ["", "x"],
    firstDirectChild: true,
  },
  output: { result: { placeholder: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/select-placeholder-option-check",
  title: "HTML Select Placeholder Option Check",
  description:
    "Check the supplied select placeholder-label-option conditions for a direct first empty-valued option; no DOM or validation state inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
