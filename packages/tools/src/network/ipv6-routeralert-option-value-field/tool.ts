import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly high: number; readonly low: number };
export type Output = { readonly value: number; readonly knownLabel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    high: { type: "integer", minimum: 0, maximum: 255 },
    low: { type: "integer", minimum: 0, maximum: 255 },
  },
  required: ["high", "low"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "integer" },
    knownLabel: { type: "string", maxLength: 8192 },
  },
  required: ["value", "knownLabel"],
} as const;
/** Compute ipv6 routeralert option value field from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { high, low } = input;
  const compute = (): Output => {
    integer(high, 0, 255);
    integer(low, 0, 255);
    const value = high * 256 + low;
    return {
      value,
      knownLabel:
        value === 0
          ? "mld"
          : value === 1
            ? "rsvp"
            : value === 2
              ? "active-networks"
              : "unassigned-or-other",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { high: 0, low: 0 },
  output: { value: 0, knownLabel: "mld" },
} satisfies ToolExample<Input, Output>;
export const ipv6RouteralertOptionValueFieldTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/ipv6-routeralert-option-value-field",
  title: "IPv6 Routeralert Option Value Field Tool",
  description:
    "Compute ipv6 routeralert option value field from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "high",
        label: "High",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "low",
        label: "Low",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "value", label: "Value", valueType: { type: "integer" } },
      { id: "knownLabel", label: "Known Label", valueType: { type: "string" } },
    ],
  },
});
export const run = ipv6RouteralertOptionValueFieldTool.execute;
export default ipv6RouteralertOptionValueFieldTool;
