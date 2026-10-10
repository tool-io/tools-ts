import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly offeredMilliliters: number;
  readonly residualMilliliters: number;
};
export type Output = {
  readonly recordedDifferenceMilliliters: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    offeredMilliliters: { type: "number", minimum: 0 },
    residualMilliliters: { type: "number", minimum: 0 },
  },
  required: ["recordId", "offeredMilliliters", "residualMilliliters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDifferenceMilliliters: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["recordedDifferenceMilliliters", "label"],
} as const;
/** Reconcile explicit offered and residual feeding volumes, retaining signed discrepancies without recommending intake. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, offeredMilliliters, residualMilliliters } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      offeredMilliliters >= 0 && residualMilliliters >= 0,
      "offeredMilliliters",
    );
    return {
      recordedDifferenceMilliliters: offeredMilliliters - residualMilliliters,
      label:
        recordId +
        "; offered=" +
        offeredMilliliters +
        " mL; residual=" +
        residualMilliliters +
        " mL",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "F17", offeredMilliliters: 120, residualMilliliters: 20 },
  output: {
    recordedDifferenceMilliliters: 100,
    label: "F17; offered=120 mL; residual=20 mL",
  },
} satisfies ToolExample<Input, Output>;
export const pediatricFeedingVolumeRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pediatrics", "health and medicine"],
      keywords: ["pediatrics", "health and medicine"],
    },
    id: "pediatrics/pediatric-feeding-volume-record",
    title: "Pediatric Feeding Volume Record",
    description:
      "Reconcile explicit offered and residual feeding volumes, retaining signed discrepancies without recommending intake.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        offeredMilliliters: { type: "number", minimum: 0 },
        residualMilliliters: { type: "number", minimum: 0 },
      },
      required: ["recordId", "offeredMilliliters", "residualMilliliters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDifferenceMilliliters: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["recordedDifferenceMilliliters", "label"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "offeredMilliliters",
          label: "Offered Milliliters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residualMilliliters",
          label: "Residual Milliliters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recordedDifferenceMilliliters",
          label: "Recorded Difference Milliliters",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = pediatricFeedingVolumeRecordTool.execute;
export default pediatricFeedingVolumeRecordTool;
