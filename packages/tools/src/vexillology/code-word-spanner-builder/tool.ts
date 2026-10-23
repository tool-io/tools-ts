import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualAsciiCodeWord: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualAsciiCodeWord",
    label: "Actual ascii code word",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!/^[A-Z]{1,32}$/.test(input.actualAsciiCodeWord))
    simpleError("word", "Actualuppercase1–32letters.");
  return { standaloneFlagLetterLabels: Array.from(input.actualAsciiCodeWord) };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualAsciiCodeWord: "CAB" },
  output: { result: { standaloneFlagLetterLabels: ["C", "A", "B"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/code-word-spanner-builder",
  title: "Code Word Spanner Builder (ICS)",
  description:
    "Literalcodewordspelledasletterflaglabels ONLY,nocolor/layout/photovisualrecognition;NOTtranslateswordintoauthorizedICSmeaning. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
          standaloneFlagLetterLabels: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["standaloneFlagLetterLabels"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
