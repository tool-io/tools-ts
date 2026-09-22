import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logit: number;
  readonly temperature: number;
  readonly suppliedScaledLogit: number;
};
export type Output = {
  readonly scaledLogit: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logit: { type: "number" },
    temperature: { type: "number", exclusiveMinimum: 0 },
    suppliedScaledLogit: { type: "number" },
  },
  required: ["logit", "temperature", "suppliedScaledLogit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaledLogit: { type: "number" }, residual: { type: "number" } },
  required: ["scaledLogit", "residual"],
} as const;
/** Inspect one explicit temperature-scaled logit; no probability normalization or model call. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logit, temperature, suppliedScaledLogit } = request;
  const compute = (): Output => {
    H.positive(temperature);
    return {
      scaledLogit: logit / temperature,
      residual: suppliedScaledLogit - logit / temperature,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logit: 6, temperature: 2, suppliedScaledLogit: 2.5 },
  output: { scaledLogit: 3, residual: -0.5 },
} satisfies ToolExample<Input, Output>;
export const tokenLogitScalingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/token-logit-scaling-gap",
    title: "Token Logit Scaling Gap Tool",
    description:
      "Inspect one explicit temperature-scaled logit; no probability normalization or model call.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logit: { type: "number" },
        temperature: { type: "number", exclusiveMinimum: 0 },
        suppliedScaledLogit: { type: "number" },
      },
      required: ["logit", "temperature", "suppliedScaledLogit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaledLogit: { type: "number" },
        residual: { type: "number" },
      },
      required: ["scaledLogit", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "logit",
          label: "Logit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperature",
          label: "Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScaledLogit",
          label: "Supplied Scaled Logit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledLogit",
          label: "Scaled Logit",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tokenLogitScalingGapTool.execute;
export default tokenLogitScalingGapTool;
