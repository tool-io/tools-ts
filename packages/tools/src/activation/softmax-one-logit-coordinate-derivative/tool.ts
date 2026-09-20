import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probabilities: readonly number[];
  readonly row: number;
  readonly column: number;
  readonly temperature: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    temperature: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["probabilities", "row", "column", "temperature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Return one softmax Jacobian entry from a validated probability vector and explicit positive temperature. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { probabilities, row, column, temperature } = input;
  const compute = (): Output => {
    H.positive(temperature);
    H.integer(row, 0, probabilities.length - 1);
    H.integer(column, 0, probabilities.length - 1);
    H.domain(
      probabilities.every((x) => x >= 0 && x <= 1) &&
        Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) <= 1e-12,
    );
    return {
      derivative:
        (probabilities[row] *
          ((row === column ? 1 : 0) - probabilities[column])) /
        temperature,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { probabilities: [0.25, 0.75], row: 0, column: 1, temperature: 1 },
  output: { derivative: -0.1875 },
} satisfies ToolExample<Input, Output>;
export const softmaxOneLogitCoordinateDerivativeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "activation/softmax-one-logit-coordinate-derivative",
      title: "Softmax One Logit Coordinate Derivative Tool",
      description:
        "Return one softmax Jacobian entry from a validated probability vector and explicit positive temperature.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          probabilities: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          row: { type: "integer", minimum: 0 },
          column: { type: "integer", minimum: 0 },
          temperature: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["probabilities", "row", "column", "temperature"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
      },
      ports: {
        inputs: [
          {
            id: "probabilities",
            label: "Probabilities",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "row",
            label: "Row",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "column",
            label: "Column",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "temperature",
            label: "Temperature",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = softmaxOneLogitCoordinateDerivativeTool.execute;
export default softmaxOneLogitCoordinateDerivativeTool;
