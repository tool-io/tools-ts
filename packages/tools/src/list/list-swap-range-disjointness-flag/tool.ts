import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = { readonly disjoint: boolean; readonly touching: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "integer", minimum: 0 },
    firstEnd: { type: "integer" },
    secondStart: { type: "integer", minimum: 0 },
    secondEnd: { type: "integer" },
  },
  required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { disjoint: { type: "boolean" }, touching: { type: "boolean" } },
  required: ["disjoint", "touching"],
} as const;
/** Calculate list swap range disjointness flag from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = input;
  const compute = (): Output => {
    H.integer(firstStart, 0);
    H.integer(firstEnd, firstStart);
    H.integer(secondStart, 0);
    H.integer(secondEnd, secondStart);
    return {
      disjoint:
        firstStart === firstEnd ||
        secondStart === secondEnd ||
        firstEnd <= secondStart ||
        secondEnd <= firstStart,
      touching: firstEnd === secondStart || secondEnd === firstStart,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstStart: 1, firstEnd: 3, secondStart: 3, secondEnd: 5 },
  output: { disjoint: true, touching: true },
} satisfies ToolExample<Input, Output>;
export const listSwapRangeDisjointnessFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-swap-range-disjointness-flag",
    title: "List Swap Range Disjointness Flag Tool",
    description:
      "Calculate list swap range disjointness flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "integer", minimum: 0 },
        firstEnd: { type: "integer" },
        secondStart: { type: "integer", minimum: 0 },
        secondEnd: { type: "integer" },
      },
      required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        disjoint: { type: "boolean" },
        touching: { type: "boolean" },
      },
      required: ["disjoint", "touching"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondEnd",
          label: "Second End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "disjoint", label: "Disjoint", valueType: { type: "boolean" } },
        { id: "touching", label: "Touching", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = listSwapRangeDisjointnessFlagTool.execute;
export default listSwapRangeDisjointnessFlagTool;
