import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly started: number;
  readonly excluded: number;
  readonly paid: number;
};
export type Output = { readonly eligible: number; readonly conversion: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    started: { type: "integer", minimum: 1 },
    excluded: { type: "integer", minimum: 0 },
    paid: { type: "integer", minimum: 0 },
  },
  required: ["started", "excluded", "paid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligible: { type: "integer" }, conversion: { type: "number" } },
  required: ["eligible", "conversion"],
} as const;
/** Calculate subscription trial paid transition share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { started, excluded, paid } = request;
  const compute = (): Output => {
    H.integer(started, 1);
    H.integer(excluded, 0, started - 1);
    H.integer(paid, 0, started - excluded);
    return {
      eligible: started - excluded,
      conversion: paid / (started - excluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { started: 120, excluded: 20, paid: 30 },
  output: { eligible: 100, conversion: 0.3 },
} satisfies ToolExample<Input, Output>;
export const subscriptionTrialPaidTransitionShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "marketing/subscription-trial-paid-transition-share",
      title: "Subscription Trial Paid Transition Share Tool",
      description:
        "Calculate subscription trial paid transition share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          started: { type: "integer", minimum: 1 },
          excluded: { type: "integer", minimum: 0 },
          paid: { type: "integer", minimum: 0 },
        },
        required: ["started", "excluded", "paid"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligible: { type: "integer" },
          conversion: { type: "number" },
        },
        required: ["eligible", "conversion"],
      },
      ports: {
        inputs: [
          {
            id: "started",
            label: "Started",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "paid",
            label: "Paid",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
          {
            id: "conversion",
            label: "Conversion",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = subscriptionTrialPaidTransitionShareTool.execute;
export default subscriptionTrialPaidTransitionShareTool;
