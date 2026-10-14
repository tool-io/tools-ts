import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualPlainSubtitleText: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualPlainSubtitleText",
    label: "Actual plain subtitle text",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  const a = input.actualPlainSubtitleText
    .split(/\r?\n/)
    .map((v) => Array.from(v).length);
  return {
    observedCodePointCountsByLine: a,
    maximumObservedCodePointLineLength: Math.max(...a),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPlainSubtitleText: "Hi \ud83c\udfa5\nGoodbye" },
  output: {
    result: {
      observedCodePointCountsByLine: [4, 7],
      maximumObservedCodePointLineLength: 7,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/subtitle-line-length",
  title: "Subtitle Line Length Calculator",
  description:
    "Plain text subtitle perlineUnicodecodepointcounts, spaces included, CRLF normalized. Not grapheme/display column width, text shaping, HTML mark up decoding or reading-speed/caption standard compliance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedCodePointCountsByLine: {
            type: "array",
            items: { type: "number" },
          },
          maximumObservedCodePointLineLength: { type: "number" },
        },
        required: [
          "observedCodePointCountsByLine",
          "maximumObservedCodePointLineLength",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
