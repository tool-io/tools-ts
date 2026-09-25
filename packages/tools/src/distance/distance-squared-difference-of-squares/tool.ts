import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = { readonly squaredDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", minimum: 0 },
    second: { type: "number", minimum: 0 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { squaredDifference: { type: "number" } },
  required: ["squaredDifference"],
} as const;
/** Calculate distance squared difference of squares from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.domain(first >= 0 && second >= 0);
    return { squaredDifference: (first - second) * (first + second) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 5, second: 3 },
  output: { squaredDifference: 16 },
} satisfies ToolExample<Input, Output>;
export const distanceSquaredDifferenceOfSquaresTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/distance-squared-difference-of-squares",
    title: "Distance Squared Difference Of Squares Tool",
    description:
      "Calculate distance squared difference of squares from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", minimum: 0 },
        second: { type: "number", minimum: 0 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { squaredDifference: { type: "number" } },
      required: ["squaredDifference"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "squaredDifference",
          label: "Squared Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = distanceSquaredDifferenceOfSquaresTool.execute;
export default distanceSquaredDifferenceOfSquaresTool;
