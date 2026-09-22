import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly suppliedThreshold: number;
  readonly inclusive: boolean;
};
export type Output = {
  readonly margin: number;
  readonly requiresDisclosureByRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    suppliedThreshold: { type: "number", minimum: 0 },
    inclusive: { type: "boolean" },
  },
  required: ["amount", "suppliedThreshold", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margin: { type: "number" },
    requiresDisclosureByRule: { type: "boolean" },
  },
  required: ["margin", "requiresDisclosureByRule"],
} as const;
/** Apply an explicit threshold and equality convention, without selecting a disclosure rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, suppliedThreshold, inclusive } = request;
  const compute = (): Output => {
    H.domain(amount >= 0 && suppliedThreshold >= 0);
    return {
      margin: amount - suppliedThreshold,
      requiresDisclosureByRule: inclusive
        ? amount >= suppliedThreshold
        : amount > suppliedThreshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 500, suppliedThreshold: 500, inclusive: true },
  output: { margin: 0, requiresDisclosureByRule: true },
} satisfies ToolExample<Input, Output>;
export const ethicsDisclosureFinancialThresholdMarginTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioethics/ethics-disclosure-financial-threshold-margin",
      title: "Ethics Disclosure Financial Threshold Margin Tool",
      description:
        "Apply an explicit threshold and equality convention, without selecting a disclosure rule.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          amount: { type: "number", minimum: 0 },
          suppliedThreshold: { type: "number", minimum: 0 },
          inclusive: { type: "boolean" },
        },
        required: ["amount", "suppliedThreshold", "inclusive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          margin: { type: "number" },
          requiresDisclosureByRule: { type: "boolean" },
        },
        required: ["margin", "requiresDisclosureByRule"],
      },
      ports: {
        inputs: [
          {
            id: "amount",
            label: "Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedThreshold",
            label: "Supplied Threshold",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inclusive",
            label: "Inclusive",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "margin", label: "Margin", valueType: { type: "number" } },
          {
            id: "requiresDisclosureByRule",
            label: "Requires Disclosure By Rule",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ethicsDisclosureFinancialThresholdMarginTool.execute;
export default ethicsDisclosureFinancialThresholdMarginTool;
