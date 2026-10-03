import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCount: number;
  readonly secondCount: number;
};
export type Output = { readonly count: number; readonly fromFirst: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCount: { type: "integer", minimum: 0 },
    secondCount: { type: "integer", minimum: 0 },
  },
  required: ["firstCount", "secondCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" }, fromFirst: { type: "boolean" } },
  required: ["count", "fromFirst"],
} as const;
/** Calculate multiset symmetric difference one count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCount, secondCount } = request;
  const compute = (): Output => {
    H.integer(firstCount, 0);
    H.integer(secondCount, 0);
    return {
      count: Math.abs(firstCount - secondCount),
      fromFirst: firstCount > secondCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCount: 5, secondCount: 2 },
  output: { count: 3, fromFirst: true },
} satisfies ToolExample<Input, Output>;
export const multisetSymmetricDifferenceOneCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "set/multiset-symmetric-difference-one-count",
      title: "Multiset Symmetric Difference One Count Tool",
      description:
        "Calculate multiset symmetric difference one count from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstCount: { type: "integer", minimum: 0 },
          secondCount: { type: "integer", minimum: 0 },
        },
        required: ["firstCount", "secondCount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          count: { type: "integer" },
          fromFirst: { type: "boolean" },
        },
        required: ["count", "fromFirst"],
      },
      ports: {
        inputs: [
          {
            id: "firstCount",
            label: "First Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondCount",
            label: "Second Count",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "count", label: "Count", valueType: { type: "integer" } },
          {
            id: "fromFirst",
            label: "From First",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = multisetSymmetricDifferenceOneCountTool.execute;
export default multisetSymmetricDifferenceOneCountTool;
