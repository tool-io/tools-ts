import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualText", label: "Actual text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = Array.from(input.actualText);
  if (!a.length || a.length > 80 || /[^ -~]/.test(input.actualText))
    simpleError("banner", "1–80singlelineprintableASCII.");
  const line = "+" + "-".repeat(a.length + 2) + "+";
  return { bannerLines: [line, "| " + input.actualText + " |", line] };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualText: "HI" },
  output: { result: { bannerLines: ["+----+", "| HI |", "+----+"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/ascii-art-banner",
  title: "ASCII Art Banner Generator",
  description:
    "SimpleboxedASCIIartbanner,not FIGletfont emulation. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
