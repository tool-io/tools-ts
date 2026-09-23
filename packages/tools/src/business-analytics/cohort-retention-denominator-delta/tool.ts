import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retained: number;
  readonly originalBase: number;
  readonly revisedBase: number;
};
export type Output = {
  readonly oldRate: number;
  readonly revisedRate: number;
  readonly delta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retained: { type: "integer", minimum: 0 },
    originalBase: { type: "integer", minimum: 1 },
    revisedBase: { type: "integer", minimum: 1 },
  },
  required: ["retained", "originalBase", "revisedBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldRate: { type: "number" },
    revisedRate: { type: "number" },
    delta: { type: "number" },
  },
  required: ["oldRate", "revisedRate", "delta"],
} as const;
/** Isolate a supplied retention denominator revision while holding retained records fixed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retained, originalBase, revisedBase } = request;
  const compute = (): Output => {
    H.integer(originalBase, 1);
    H.integer(revisedBase, 1);
    H.integer(retained, 0, Math.min(originalBase, revisedBase));
    return {
      oldRate: retained / originalBase,
      revisedRate: retained / revisedBase,
      delta: retained / revisedBase - retained / originalBase,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retained: 40, originalBase: 100, revisedBase: 80 },
  output: { oldRate: 0.4, revisedRate: 0.5, delta: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const cohortRetentionDenominatorDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/cohort-retention-denominator-delta",
    title: "Cohort Retention Denominator Delta Tool",
    description:
      "Isolate a supplied retention denominator revision while holding retained records fixed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retained: { type: "integer", minimum: 0 },
        originalBase: { type: "integer", minimum: 1 },
        revisedBase: { type: "integer", minimum: 1 },
      },
      required: ["retained", "originalBase", "revisedBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldRate: { type: "number" },
        revisedRate: { type: "number" },
        delta: { type: "number" },
      },
      required: ["oldRate", "revisedRate", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "retained",
          label: "Retained",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originalBase",
          label: "Original Base",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "revisedBase",
          label: "Revised Base",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "oldRate", label: "Old Rate", valueType: { type: "number" } },
        {
          id: "revisedRate",
          label: "Revised Rate",
          valueType: { type: "number" },
        },
        { id: "delta", label: "Delta", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cohortRetentionDenominatorDeltaTool.execute;
export default cohortRetentionDenominatorDeltaTool;
