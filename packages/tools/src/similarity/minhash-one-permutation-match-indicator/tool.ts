import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMinimum: string;
  readonly secondMinimum: string;
  readonly firstEmpty: boolean;
  readonly secondEmpty: boolean;
};
export type Output = { readonly comparable: boolean; readonly match: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMinimum: { type: "string", maxLength: 8192 },
    secondMinimum: { type: "string", maxLength: 8192 },
    firstEmpty: { type: "boolean" },
    secondEmpty: { type: "boolean" },
  },
  required: ["firstMinimum", "secondMinimum", "firstEmpty", "secondEmpty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { comparable: { type: "boolean" }, match: { type: "integer" } },
  required: ["comparable", "match"],
} as const;
/** Calculate minhash one permutation match indicator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMinimum, secondMinimum, firstEmpty, secondEmpty } = request;
  const compute = (): Output => {
    const comparable = !firstEmpty && !secondEmpty;
    return {
      comparable,
      match: comparable && firstMinimum === secondMinimum ? 1 : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstMinimum: "a",
    secondMinimum: "a",
    firstEmpty: false,
    secondEmpty: false,
  },
  output: { comparable: true, match: 1 },
} satisfies ToolExample<Input, Output>;
export const minhashOnePermutationMatchIndicatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/minhash-one-permutation-match-indicator",
      title: "Minhash One Permutation Match Indicator Tool",
      description:
        "Calculate minhash one permutation match indicator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstMinimum: { type: "string", maxLength: 8192 },
          secondMinimum: { type: "string", maxLength: 8192 },
          firstEmpty: { type: "boolean" },
          secondEmpty: { type: "boolean" },
        },
        required: [
          "firstMinimum",
          "secondMinimum",
          "firstEmpty",
          "secondEmpty",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          comparable: { type: "boolean" },
          match: { type: "integer" },
        },
        required: ["comparable", "match"],
      },
      ports: {
        inputs: [
          {
            id: "firstMinimum",
            label: "First Minimum",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondMinimum",
            label: "Second Minimum",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstEmpty",
            label: "First Empty",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "secondEmpty",
            label: "Second Empty",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "comparable",
            label: "Comparable",
            valueType: { type: "boolean" },
          },
          { id: "match", label: "Match", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = minhashOnePermutationMatchIndicatorTool.execute;
export default minhashOnePermutationMatchIndicatorTool;
