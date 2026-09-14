import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  sourceFor,
  draw,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly actualText: string;
  readonly marksPerCodepoint: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "actualText", label: "Actual text", kind: "string" },
  { id: "marksPerCodepoint", label: "Marks per codepoint", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  bounded(input.marksPerCodepoint, "marks", 1, 8);
  if (!input.actualText.length || Array.from(input.actualText).length > 128)
    simpleError("text", "1–128codepoints.");
  const marks = ["\u0300", "\u0301", "\u0308", "\u0323"];
  return {
    corruptedText: Array.from(input.actualText)
      .map(
        (c) =>
          c +
          Array.from(
            { length: input.marksPerCodepoint },
            () => marks[draw(0, 3, random)],
          ).join(""),
      )
      .join(""),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", actualText: "AB", marksPerCodepoint: 1 },
  output: {
    result: {
      corruptedText: "ÁB́",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/zalgo-text-corruptor",
  title: "Zalgo Text Corruptor",
  description:
    "BoundedfourcombiningmarkZalgotextdecoration,not arbitrarycomplexrendering/normalization safety. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
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
