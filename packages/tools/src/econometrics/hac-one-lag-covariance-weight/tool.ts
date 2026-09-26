import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lag: number;
  readonly bandwidth: number;
  readonly covariance: number;
};
export type Output = {
  readonly bartlettWeight: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lag: { type: "integer", minimum: 0 },
    bandwidth: { type: "integer", minimum: 0 },
    covariance: { type: "number" },
  },
  required: ["lag", "bandwidth", "covariance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bartlettWeight: { type: "number" },
    contribution: { type: "number" },
  },
  required: ["bartlettWeight", "contribution"],
} as const;
/** One Bartlett-kernel lag contribution; no automatic factor-of-two symmetrization or bandwidth selection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lag, bandwidth, covariance } = request;
  const compute = (): Output => {
    H.integer(lag, 0);
    H.integer(bandwidth, 0);
    return {
      bartlettWeight: lag <= bandwidth ? 1 - lag / (bandwidth + 1) : 0,
      contribution:
        (lag <= bandwidth ? 1 - lag / (bandwidth + 1) : 0) * covariance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lag: 2, bandwidth: 3, covariance: 8 },
  output: { bartlettWeight: 0.5, contribution: 4 },
} satisfies ToolExample<Input, Output>;
export const hacOneLagCovarianceWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/hac-one-lag-covariance-weight",
    title: "Hac One Lag Covariance Weight Tool",
    description:
      "One Bartlett-kernel lag contribution; no automatic factor-of-two symmetrization or bandwidth selection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lag: { type: "integer", minimum: 0 },
        bandwidth: { type: "integer", minimum: 0 },
        covariance: { type: "number" },
      },
      required: ["lag", "bandwidth", "covariance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bartlettWeight: { type: "number" },
        contribution: { type: "number" },
      },
      required: ["bartlettWeight", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "lag",
          label: "Lag",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bandwidth",
          label: "Bandwidth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "covariance",
          label: "Covariance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bartlettWeight",
          label: "Bartlett Weight",
          valueType: { type: "number" },
        },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hacOneLagCovarianceWeightTool.execute;
export default hacOneLagCovarianceWeightTool;
