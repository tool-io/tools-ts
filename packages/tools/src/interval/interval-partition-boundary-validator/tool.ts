import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orderedPair } from "../batch53-shared.js";

export type Input = Readonly<{
  boundaries: readonly number[];
  domainStart: number;
  domainEnd: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "boundaries", label: "Boundaries", kind: "numberList" },
  { id: "domainStart", label: "Domain start", kind: "number" },
  { id: "domainEnd", label: "Domain end", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  orderedPair(i.domainStart, i.domainEnd, true);
  const firstMatches = i.boundaries[0] === i.domainStart,
    lastMatches = i.boundaries.at(-1) === i.domainEnd,
    nonIncreasingIndexes = i.boundaries.flatMap((v, j) =>
      j > 0 && v <= i.boundaries[j - 1] ? [j] : [],
    );
  return {
    valid:
      i.boundaries.length >= 2 &&
      firstMatches &&
      lastMatches &&
      !nonIncreasingIndexes.length,
    firstMatches,
    lastMatches,
    nonIncreasingIndexes,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { boundaries: [0, 1, 2], domainStart: 0, domainEnd: 2 },
  output: {
    result: {
      valid: true,
      firstMatches: true,
      lastMatches: true,
      nonIncreasingIndexes: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-partition-boundary-validator",
  title: "Interval Partition Boundary Validator",
  description:
    "Validate strictly increasing partition boundaries exactly spanning the domain; report failures rather than sorting or repairing input.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          valid: { type: "boolean" },
          firstMatches: { type: "boolean" },
          lastMatches: { type: "boolean" },
          nonIncreasingIndexes: { type: "array", items: { type: "number" } },
        },
        required: [
          "valid",
          "firstMatches",
          "lastMatches",
          "nonIncreasingIndexes",
        ],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
