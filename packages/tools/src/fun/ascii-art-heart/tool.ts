import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualHeartScale: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualHeartScale", label: "Actual heart scale", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  bounded(input.actualHeartScale, "scale", 1, 8);
  const base = [" ** ** ", "*******", " ***** ", "  ***  ", "   *   "];
  return {
    heartLines: base.flatMap((r) =>
      Array<string>(input.actualHeartScale).fill(
        Array.from(r)
          .map((c) => c.repeat(input.actualHeartScale))
          .join(""),
      ),
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualHeartScale: 1 },
  output: {
    result: {
      heartLines: [" ** ** ", "*******", " ***** ", "  ***  ", "   *   "],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/ascii-art-heart",
  title: "ASCII Art Heart Generator",
  description:
    "Fixedfive-roworiginalASCIIheartwithintegernearest-cell scaling. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          heartLines: { type: "array", items: { type: "string" } },
        },
        required: ["heartLines"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
