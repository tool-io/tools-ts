import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly approvalDay: number;
  readonly noticeDays: number;
  readonly implementationDay: number;
  readonly expiryDay: number;
};
export type Output = {
  readonly earliestDay: number;
  readonly lowerMargin: number;
  readonly upperMargin: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    approvalDay: { type: "integer" },
    noticeDays: { type: "integer", minimum: 0 },
    implementationDay: { type: "integer" },
    expiryDay: { type: "integer" },
  },
  required: ["approvalDay", "noticeDays", "implementationDay", "expiryDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestDay: { type: "integer" },
    lowerMargin: { type: "integer" },
    upperMargin: { type: "integer" },
    inside: { type: "boolean" },
  },
  required: ["earliestDay", "lowerMargin", "upperMargin", "inside"],
} as const;
/** Audit explicit implementation timing under caller-supplied dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { approvalDay, noticeDays, implementationDay, expiryDay } = request;
  const compute = (): Output => {
    H.integer(noticeDays, 0);
    H.domain(expiryDay >= approvalDay);
    return {
      earliestDay: approvalDay + noticeDays,
      lowerMargin: implementationDay - approvalDay - noticeDays,
      upperMargin: expiryDay - implementationDay,
      inside:
        implementationDay >= approvalDay + noticeDays &&
        implementationDay <= expiryDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    approvalDay: 100,
    noticeDays: 10,
    implementationDay: 115,
    expiryDay: 130,
  },
  output: { earliestDay: 110, lowerMargin: 5, upperMargin: 15, inside: true },
} satisfies ToolExample<Input, Output>;
export const regulatoryVariationEffectiveDateWindowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/regulatory-variation-effective-date-window",
      title: "Regulatory Variation Effective Date Window Tool",
      description:
        "Audit explicit implementation timing under caller-supplied dates.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          approvalDay: { type: "integer" },
          noticeDays: { type: "integer", minimum: 0 },
          implementationDay: { type: "integer" },
          expiryDay: { type: "integer" },
        },
        required: [
          "approvalDay",
          "noticeDays",
          "implementationDay",
          "expiryDay",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          earliestDay: { type: "integer" },
          lowerMargin: { type: "integer" },
          upperMargin: { type: "integer" },
          inside: { type: "boolean" },
        },
        required: ["earliestDay", "lowerMargin", "upperMargin", "inside"],
      },
      ports: {
        inputs: [
          {
            id: "approvalDay",
            label: "Approval Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "noticeDays",
            label: "Notice Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "implementationDay",
            label: "Implementation Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "expiryDay",
            label: "Expiry Day",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "earliestDay",
            label: "Earliest Day",
            valueType: { type: "integer" },
          },
          {
            id: "lowerMargin",
            label: "Lower Margin",
            valueType: { type: "integer" },
          },
          {
            id: "upperMargin",
            label: "Upper Margin",
            valueType: { type: "integer" },
          },
          { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = regulatoryVariationEffectiveDateWindowTool.execute;
export default regulatoryVariationEffectiveDateWindowTool;
