import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly suppliedRate: number;
  readonly continuous: boolean;
};
export type Output = {
  readonly discountFactor: number;
  readonly logDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    suppliedRate: { type: "number" },
    continuous: { type: "boolean" },
  },
  required: ["time", "suppliedRate", "continuous"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountFactor: { type: "number" },
    logDerivative: { type: "number" },
  },
  required: ["discountFactor", "logDerivative"],
} as const;
/** Derivative of log discount factor with respect to a supplied continuous or effective annual rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, suppliedRate, continuous } = request;
  const compute = (): Output => {
    H.domain(time >= 0 && (continuous || suppliedRate > -1));
    return {
      discountFactor: continuous
        ? Math.exp(-suppliedRate * time)
        : (1 + suppliedRate) ** -time,
      logDerivative: continuous ? -time : -time / (1 + suppliedRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { time: 2, suppliedRate: 0.1, continuous: true },
  output: { discountFactor: 0.8187307530779818, logDerivative: -2 },
} satisfies ToolExample<Input, Output>;
export const discountFactorLogDerivativeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/discount-factor-log-derivative-term",
    title: "Discount Factor Log Derivative Term Tool",
    description:
      "Derivative of log discount factor with respect to a supplied continuous or effective annual rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        suppliedRate: { type: "number" },
        continuous: { type: "boolean" },
      },
      required: ["time", "suppliedRate", "continuous"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountFactor: { type: "number" },
        logDerivative: { type: "number" },
      },
      required: ["discountFactor", "logDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRate",
          label: "Supplied Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "continuous",
          label: "Continuous",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "discountFactor",
          label: "Discount Factor",
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
export const run = discountFactorLogDerivativeTermTool.execute;
export default discountFactorLogDerivativeTermTool;
