import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly lower: number;
  readonly upper: number;
  readonly previousHigh: boolean;
};
export type Output = { readonly high: boolean; readonly switched: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    previousHigh: { type: "boolean" },
  },
  required: ["value", "lower", "upper", "previousHigh"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { high: { type: "boolean" }, switched: { type: "boolean" } },
  required: ["high", "switched"],
} as const;
/** Upper-inclusive rising and lower-inclusive falling switching thresholds; retain state strictly between thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lower, upper, previousHigh } = request;
  const compute = (): Output => {
    H.domain(lower < upper);
    const high = previousHigh ? value > lower : value >= upper;
    return { high, switched: high !== previousHigh };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 8, lower: 2, upper: 8, previousHigh: false },
  output: { high: true, switched: true },
} satisfies ToolExample<Input, Output>;
export const relayHysteresisOneSwitchBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/relay-hysteresis-one-switch-boundary",
    title: "Relay Hysteresis One Switch Boundary Tool",
    description:
      "Upper-inclusive rising and lower-inclusive falling switching thresholds; retain state strictly between thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        previousHigh: { type: "boolean" },
      },
      required: ["value", "lower", "upper", "previousHigh"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { high: { type: "boolean" }, switched: { type: "boolean" } },
      required: ["high", "switched"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
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
          id: "previousHigh",
          label: "Previous High",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "high", label: "High", valueType: { type: "boolean" } },
        { id: "switched", label: "Switched", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = relayHysteresisOneSwitchBoundaryTool.execute;
export default relayHysteresisOneSwitchBoundaryTool;
