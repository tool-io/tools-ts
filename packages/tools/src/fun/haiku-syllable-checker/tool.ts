import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyAnnotatedLineSyllableCounts: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlyAnnotatedLineSyllableCounts",
    label: "Actual independently annotated line syllable counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (input.actualIndependentlyAnnotatedLineSyllableCounts.length !== 3)
    simpleError(
      "lines",
      "Exactlythreeindependentlyphonologicallyannotatedcounts.",
    );
  input.actualIndependentlyAnnotatedLineSyllableCounts.forEach((v) =>
    bounded(v, "syllables", 0, 128),
  );
  return {
    matchesFiveSevenFive:
      input.actualIndependentlyAnnotatedLineSyllableCounts.every(
        (v, i) => v === [5, 7, 5][i],
      ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualIndependentlyAnnotatedLineSyllableCounts: [5, 7, 5] },
  output: { result: { matchesFiveSevenFive: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/haiku-syllable-checker",
  title: "Haiku Syllable Checker",
  description:
    "ActualexternallyresolvedEnglishsyllable5\u20137\u20135patternchecker,not Japanese mora count,naturaltextsyllableoracle or requirementofall haiku. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { matchesFiveSevenFive: { type: "boolean" } },
        required: ["matchesFiveSevenFive"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
