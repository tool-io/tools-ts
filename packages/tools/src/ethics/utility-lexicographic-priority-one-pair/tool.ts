import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPrimary: number;
  readonly secondPrimary: number;
  readonly firstSecondary: number;
  readonly secondSecondary: number;
};
export type Output = {
  readonly order: number;
  readonly primaryDecides: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPrimary: { type: "number" },
    secondPrimary: { type: "number" },
    firstSecondary: { type: "number" },
    secondSecondary: { type: "number" },
  },
  required: [
    "firstPrimary",
    "secondPrimary",
    "firstSecondary",
    "secondSecondary",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    order: { type: "integer" },
    primaryDecides: { type: "boolean" },
  },
  required: ["order", "primaryDecides"],
} as const;
/** Calculate utility lexicographic priority one pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPrimary, secondPrimary, firstSecondary, secondSecondary } =
    request;
  const compute = (): Output => {
    return {
      order:
        firstPrimary !== secondPrimary
          ? Math.sign(firstPrimary - secondPrimary)
          : Math.sign(firstSecondary - secondSecondary),
      primaryDecides: firstPrimary !== secondPrimary,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPrimary: 2,
    secondPrimary: 1,
    firstSecondary: 0,
    secondSecondary: 100,
  },
  output: { order: 1, primaryDecides: true },
} satisfies ToolExample<Input, Output>;
export const utilityLexicographicPriorityOnePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethics/utility-lexicographic-priority-one-pair",
      title: "Utility Lexicographic Priority One Pair Tool",
      description:
        "Calculate utility lexicographic priority one pair from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstPrimary: { type: "number" },
          secondPrimary: { type: "number" },
          firstSecondary: { type: "number" },
          secondSecondary: { type: "number" },
        },
        required: [
          "firstPrimary",
          "secondPrimary",
          "firstSecondary",
          "secondSecondary",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          order: { type: "integer" },
          primaryDecides: { type: "boolean" },
        },
        required: ["order", "primaryDecides"],
      },
      ports: {
        inputs: [
          {
            id: "firstPrimary",
            label: "First Primary",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondPrimary",
            label: "Second Primary",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstSecondary",
            label: "First Secondary",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondSecondary",
            label: "Second Secondary",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "order", label: "Order", valueType: { type: "integer" } },
          {
            id: "primaryDecides",
            label: "Primary Decides",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = utilityLexicographicPriorityOnePairTool.execute;
export default utilityLexicographicPriorityOnePairTool;
