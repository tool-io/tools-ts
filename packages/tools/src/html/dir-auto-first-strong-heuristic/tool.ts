import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, firstStrong } from "../batch52-shared.js";
export type Input = Readonly<{ readonly text: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    boundedFirstStrongDirection: firstStrong(i.text),
    fullUnicodeBidiAlgorithmApplied: false,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { text: "123 שלום" },
  output: {
    result: {
      boundedFirstStrongDirection: "rtl",
      fullUnicodeBidiAlgorithmApplied: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/dir-auto-first-strong-heuristic",
  title: "dir=auto First-Strong Heuristic",
  description:
    "Explicit bounded heuristic for ASCII Latin L and Hebrew/Arabic strong letters; skips numbers/punctuation/marks, reports unsupported strong-script evidence rather than pretending full Unicode bidi.",
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
          boundedFirstStrongDirection: { type: "string" },
          fullUnicodeBidiAlgorithmApplied: { type: "boolean" },
        },
        required: [
          "boundedFirstStrongDirection",
          "fullUnicodeBidiAlgorithmApplied",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
