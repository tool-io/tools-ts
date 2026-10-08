import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentResidual: number;
  readonly previousResidual: number;
  readonly autoregressiveCoefficient: number;
};
export type Output = { readonly innovation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentResidual: { type: "number" },
    previousResidual: { type: "number" },
    autoregressiveCoefficient: { type: "number" },
  },
  required: [
    "currentResidual",
    "previousResidual",
    "autoregressiveCoefficient",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { innovation: { type: "number" } },
  required: ["innovation"],
} as const;
/** Calculate a supplied one-step AR(1) residual innovation without estimating persistence or assuming stationarity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentResidual, previousResidual, autoregressiveCoefficient } =
    request;
  const compute = (): Output => {
    return {
      innovation:
        currentResidual - autoregressiveCoefficient * previousResidual,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentResidual: 5,
    previousResidual: 4,
    autoregressiveCoefficient: 0.5,
  },
  output: { innovation: 3 },
} satisfies ToolExample<Input, Output>;
export const serialCorrelationInnovationResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "econometrics/serial-correlation-innovation-residual",
      title: "Serial Correlation Innovation Residual Tool",
      description:
        "Calculate a supplied one-step AR(1) residual innovation without estimating persistence or assuming stationarity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          currentResidual: { type: "number" },
          previousResidual: { type: "number" },
          autoregressiveCoefficient: { type: "number" },
        },
        required: [
          "currentResidual",
          "previousResidual",
          "autoregressiveCoefficient",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { innovation: { type: "number" } },
        required: ["innovation"],
      },
      ports: {
        inputs: [
          {
            id: "currentResidual",
            label: "Current Residual",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "previousResidual",
            label: "Previous Residual",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "autoregressiveCoefficient",
            label: "Autoregressive Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "innovation",
            label: "Innovation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = serialCorrelationInnovationResidualTool.execute;
export default serialCorrelationInnovationResidualTool;
