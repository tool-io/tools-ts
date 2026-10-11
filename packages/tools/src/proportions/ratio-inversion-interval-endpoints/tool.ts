import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerRatio: number;
  readonly upperRatio: number;
};
export type Output = {
  readonly inverseLower: number;
  readonly inverseUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerRatio: { type: "number" },
    upperRatio: { type: "number" },
  },
  required: ["lowerRatio", "upperRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inverseLower: { type: "number" },
    inverseUpper: { type: "number" },
  },
  required: ["inverseLower", "inverseUpper"],
} as const;
/** Invert an explicit closed ratio interval that excludes zero, reversing its ordered endpoints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerRatio, upperRatio } = request;
  const compute = (): Output => {
    H.domain(lowerRatio <= upperRatio, "lowerRatio");
    H.domain(lowerRatio > 0 || upperRatio < 0, "lowerRatio");
    return { inverseLower: 1 / upperRatio, inverseUpper: 1 / lowerRatio };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerRatio: 2, upperRatio: 4 },
  output: { inverseLower: 0.25, inverseUpper: 0.5 },
} satisfies ToolExample<Input, Output>;
export const ratioInversionIntervalEndpointsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["proportions", "mathematics"],
      keywords: ["proportions", "mathematics"],
    },
    id: "proportions/ratio-inversion-interval-endpoints",
    title: "Ratio Inversion Interval Endpoints",
    description:
      "Invert an explicit closed ratio interval that excludes zero, reversing its ordered endpoints.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerRatio: { type: "number" },
        upperRatio: { type: "number" },
      },
      required: ["lowerRatio", "upperRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inverseLower: { type: "number" },
        inverseUpper: { type: "number" },
      },
      required: ["inverseLower", "inverseUpper"],
    },
    ports: {
      inputs: [
        {
          id: "lowerRatio",
          label: "Lower Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperRatio",
          label: "Upper Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "inverseLower",
          label: "Inverse Lower",
          valueType: { type: "number" },
        },
        {
          id: "inverseUpper",
          label: "Inverse Upper",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ratioInversionIntervalEndpointsTool.execute;
export default ratioInversionIntervalEndpointsTool;
