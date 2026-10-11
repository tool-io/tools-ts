import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerArgument: number;
  readonly upperArgument: number;
  readonly lowerCdf: number;
  readonly upperCdf: number;
};
export type Output = {
  readonly cdfIncrement: number;
  readonly monotone: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerArgument: { type: "number" },
    upperArgument: { type: "number" },
    lowerCdf: { type: "number", minimum: 0, maximum: 1 },
    upperCdf: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["lowerArgument", "upperArgument", "lowerCdf", "upperCdf"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cdfIncrement: { type: "number" },
    monotone: { type: "boolean" },
  },
  required: ["cdfIncrement", "monotone"],
} as const;
/** Compare explicit CDF values at strictly ordered arguments without establishing that a complete distribution is valid. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerArgument, upperArgument, lowerCdf, upperCdf } = request;
  const compute = (): Output => {
    H.domain(upperArgument > lowerArgument, "upperArgument");
    (H.domain(lowerCdf >= 0 && lowerCdf <= 1, "lowerCdf"), lowerCdf);
    (H.domain(upperCdf >= 0 && upperCdf <= 1, "upperCdf"), upperCdf);
    return {
      cdfIncrement: upperCdf - lowerCdf,
      monotone: upperCdf >= lowerCdf,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerArgument: 2, upperArgument: 4, lowerCdf: 0.3, upperCdf: 0.8 },
  output: { cdfIncrement: 0.5, monotone: true },
} satisfies ToolExample<Input, Output>;
export const twoCdfValuesMonotonicityResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["probability", "mathematics"],
      keywords: ["probability", "mathematics"],
    },
    id: "probability/two-cdf-values-monotonicity-residual",
    title: "Two Cdf Values Monotonicity Residual",
    description:
      "Compare explicit CDF values at strictly ordered arguments without establishing that a complete distribution is valid.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerArgument: { type: "number" },
        upperArgument: { type: "number" },
        lowerCdf: { type: "number", minimum: 0, maximum: 1 },
        upperCdf: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["lowerArgument", "upperArgument", "lowerCdf", "upperCdf"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cdfIncrement: { type: "number" },
        monotone: { type: "boolean" },
      },
      required: ["cdfIncrement", "monotone"],
    },
    ports: {
      inputs: [
        {
          id: "lowerArgument",
          label: "Lower Argument",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperArgument",
          label: "Upper Argument",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerCdf",
          label: "Lower Cdf",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperCdf",
          label: "Upper Cdf",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cdfIncrement",
          label: "Cdf Increment",
          valueType: { type: "number" },
        },
        { id: "monotone", label: "Monotone", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = twoCdfValuesMonotonicityResidualTool.execute;
export default twoCdfValuesMonotonicityResidualTool;
