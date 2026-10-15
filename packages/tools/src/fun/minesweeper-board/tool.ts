import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sourceFor,
  indices,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly rows: number;
  readonly columns: number;
  readonly mineCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "rows", label: "Rows", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
  { id: "mineCount", label: "Mine count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context);
  bounded(input.rows, "rows", 1, 32);
  bounded(input.columns, "cols", 1, 32);
  bounded(
    input.mineCount,
    "mines",
    0,
    Math.min(64, input.rows * input.columns),
  );
  const mines = new Set(
    input.mineCount
      ? indices(
          input.rows * input.columns,
          {
            seed: input.seed,
            count: input.mineCount,
            withoutReplacement: true,
          },
          random,
        )
      : [],
  );
  return {
    cells: Array.from({ length: input.rows }, (_, r) =>
      Array.from({ length: input.columns }, (_, c) => {
        if (mines.has(r * input.columns + c)) return -1;
        let n = 0;
        for (let y = r - 1; y <= r + 1; y++)
          for (let x = c - 1; x <= c + 1; x++)
            if (
              y >= 0 &&
              y < input.rows &&
              x >= 0 &&
              x < input.columns &&
              mines.has(y * input.columns + x)
            )
              n++;
        return n;
      }),
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", rows: 2, columns: 2, mineCount: 1 },
  output: {
    result: {
      cells: [
        [1, -1],
        [1, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/minesweeper-board",
  title: "Minesweeper Board Generator",
  description:
    "Minesweeperuniqueuniformminepositions/eightneighborcounts,\u22121mine,not safe-firstclick/puzzleuniqueness guarantee. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
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
          cells: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["cells"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
