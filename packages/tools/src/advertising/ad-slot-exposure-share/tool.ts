import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slotExposure: number;
  readonly totalExposure: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slotExposure: { type: "number", minimum: 0 },
    totalExposure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["slotExposure", "totalExposure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate ad slot exposure share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slotExposure, totalExposure } = request;
  const compute = (): Output => {
    H.positive(totalExposure);
    H.domain(slotExposure >= 0 && slotExposure <= totalExposure);
    return { share: slotExposure / totalExposure };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slotExposure: 25, totalExposure: 100 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const adSlotExposureShareTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "advertising/ad-slot-exposure-share",
      title: "Ad Slot Exposure Share Tool",
      description:
        "Calculate ad slot exposure share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          slotExposure: { type: "number", minimum: 0 },
          totalExposure: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["slotExposure", "totalExposure"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { share: { type: "number" } },
        required: ["share"],
      },
      ports: {
        inputs: [
          {
            id: "slotExposure",
            label: "Slot Exposure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalExposure",
            label: "Total Exposure",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "share", label: "Share", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = adSlotExposureShareTool.execute;
export default adSlotExposureShareTool;
