import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number", minimum: 0, maximum: 1 },
    upper: { type: "number", minimum: 0, maximum: 1 },
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
  },
  required: ["lower", "upper", "lowerClosed", "upperClosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
  },
  required: ["lower", "upper", "lowerClosed", "upperClosed"],
} as const;
/** Compute probability bound complement open closed from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lower, upper, lowerClosed, upperClosed } = input;
  const compute = (): Output => {
    probability(lower);
    probability(upper);
    domain(lower <= upper);
    return {
      lower: 1 - upper,
      upper: 1 - lower,
      lowerClosed: upperClosed,
      upperClosed: lowerClosed,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lower: 0.25, upper: 0.5, lowerClosed: true, upperClosed: false },
  output: { lower: 0.5, upper: 0.75, lowerClosed: false, upperClosed: true },
} satisfies ToolExample<Input, Output>;
export const probabilityBoundComplementOpenClosedTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "probability/probability-bound-complement-open-closed",
  title: "Probability Bound Complement Open Closed Tool",
  description:
    "Compute probability bound complement open closed from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lower",
        label: "Lower",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "upper",
        label: "Upper",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "lowerClosed",
        label: "Lower Closed",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "upperClosed",
        label: "Upper Closed",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "lower", label: "Lower", valueType: { type: "number" } },
      { id: "upper", label: "Upper", valueType: { type: "number" } },
      {
        id: "lowerClosed",
        label: "Lower Closed",
        valueType: { type: "boolean" },
      },
      {
        id: "upperClosed",
        label: "Upper Closed",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = probabilityBoundComplementOpenClosedTool.execute;
export default probabilityBoundComplementOpenClosedTool;
