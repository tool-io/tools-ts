import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly redshift: number };
export type Output = {
  readonly scaleFactor: number;
  readonly derivative: number;
  readonly logDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { redshift: { type: "number", exclusiveMinimum: -1 } },
  required: ["redshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleFactor: { type: "number" },
    derivative: { type: "number" },
    logDerivative: { type: "number" },
  },
  required: ["scaleFactor", "derivative", "logDerivative"],
} as const;
/** Normalize the present scale factor to one; derivatives are da/dz and d(ln a)/dz. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { redshift } = request;
  const compute = (): Output => {
    H.domain(redshift > -1);
    return {
      scaleFactor: 1 / (1 + redshift),
      derivative: -1 / (1 + redshift) ** 2,
      logDerivative: -1 / (1 + redshift),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { redshift: 1 },
  output: { scaleFactor: 0.5, derivative: -0.25, logDerivative: -0.5 },
} satisfies ToolExample<Input, Output>;
export const scaleFactorRedshiftLogDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/scale-factor-redshift-log-derivative",
    title: "Scale Factor Redshift Log Derivative Tool",
    description:
      "Normalize the present scale factor to one; derivatives are da/dz and d(ln a)/dz.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { redshift: { type: "number", exclusiveMinimum: -1 } },
      required: ["redshift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleFactor: { type: "number" },
        derivative: { type: "number" },
        logDerivative: { type: "number" },
      },
      required: ["scaleFactor", "derivative", "logDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "redshift",
          label: "Redshift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaleFactor",
          label: "Scale Factor",
          valueType: { type: "number" },
        },
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
        {
          id: "logDerivative",
          label: "Log Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaleFactorRedshiftLogDerivativeTool.execute;
export default scaleFactorRedshiftLogDerivativeTool;
