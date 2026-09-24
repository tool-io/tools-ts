import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offered: number;
  readonly unavailable: number;
  readonly disallowed: number;
  readonly sharedExclusions: number;
};
export type Output = { readonly available: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offered: { type: "integer", minimum: 0 },
    unavailable: { type: "integer", minimum: 0 },
    disallowed: { type: "integer", minimum: 0 },
    sharedExclusions: { type: "integer", minimum: 0 },
  },
  required: ["offered", "unavailable", "disallowed", "sharedExclusions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { available: { type: "integer" } },
  required: ["available"],
} as const;
/** Calculate consumer choice available option budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offered, unavailable, disallowed, sharedExclusions } = request;
  const compute = (): Output => {
    H.integer(offered, 0);
    H.integer(unavailable, 0, offered);
    H.integer(disallowed, 0, offered);
    H.integer(sharedExclusions, 0, Math.min(unavailable, disallowed));
    H.domain(unavailable + disallowed - sharedExclusions <= offered);
    return { available: offered - unavailable - disallowed + sharedExclusions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offered: 10, unavailable: 3, disallowed: 2, sharedExclusions: 1 },
  output: { available: 6 },
} satisfies ToolExample<Input, Output>;
export const consumerChoiceAvailableOptionBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "consumer-behavior/consumer-choice-available-option-budget",
      title: "Consumer Choice Available Option Budget Tool",
      description:
        "Calculate consumer choice available option budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          offered: { type: "integer", minimum: 0 },
          unavailable: { type: "integer", minimum: 0 },
          disallowed: { type: "integer", minimum: 0 },
          sharedExclusions: { type: "integer", minimum: 0 },
        },
        required: ["offered", "unavailable", "disallowed", "sharedExclusions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { available: { type: "integer" } },
        required: ["available"],
      },
      ports: {
        inputs: [
          {
            id: "offered",
            label: "Offered",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unavailable",
            label: "Unavailable",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "disallowed",
            label: "Disallowed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "sharedExclusions",
            label: "Shared Exclusions",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "available",
            label: "Available",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = consumerChoiceAvailableOptionBudgetTool.execute;
export default consumerChoiceAvailableOptionBudgetTool;
