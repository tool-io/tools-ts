import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sourceFor,
  shuffle,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly bagCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "bagCount", label: "Bag count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context);
  bounded(input.bagCount, "bags", 1, 64);
  return {
    pieces: Array.from({ length: input.bagCount }, () =>
      shuffle(["I", "J", "L", "O", "S", "T", "Z"], random),
    ).flat(),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", bagCount: 1 },
  output: {
    result: {
      pieces: ["S", "I", "O", "J", "T", "Z", "L"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/tetris-sequence",
  title: "Tetris Piece Sequence Generator",
  description:
    "Tetris7bagshuffle,oneadvancingsource,eachbagonceeachpiece,not independentwithreplacement sequence. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { pieces: { type: "array", items: { type: "string" } } },
        required: ["pieces"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
