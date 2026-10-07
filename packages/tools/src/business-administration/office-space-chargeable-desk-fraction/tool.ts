import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chargeableDesks: number;
  readonly totalDesks: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chargeableDesks: { type: "number", minimum: 0 },
    totalDesks: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["chargeableDesks", "totalDesks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate a supplied chargeable-desk fraction and nonchargeable remainder over a positive office desk count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chargeableDesks, totalDesks } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(totalDesks) && totalDesks > 0, "totalDesks"),
      totalDesks);
    H.domain(
      chargeableDesks >= 0 && chargeableDesks <= totalDesks,
      "chargeableDesks",
    );
    return {
      fraction: chargeableDesks / totalDesks,
      remainder: totalDesks - chargeableDesks,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chargeableDesks: 30, totalDesks: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const officeSpaceChargeableDeskFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/office-space-chargeable-desk-fraction",
    title: "Office Space Chargeable Desk Fraction",
    description:
      "Calculate a supplied chargeable-desk fraction and nonchargeable remainder over a positive office desk count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chargeableDesks: { type: "number", minimum: 0 },
        totalDesks: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["chargeableDesks", "totalDesks"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "chargeableDesks",
          label: "Chargeable Desks",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalDesks",
          label: "Total Desks",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = officeSpaceChargeableDeskFractionTool.execute;
export default officeSpaceChargeableDeskFractionTool;
