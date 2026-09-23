import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly physical: number;
  readonly reserved: number;
  readonly quarantine: number;
  readonly dailyUse: number;
  readonly leadDays: number;
};
export type Output = {
  readonly usable: number;
  readonly coverDays: number;
  readonly leadGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physical: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
    quarantine: { type: "integer", minimum: 0 },
    dailyUse: { type: "number", exclusiveMinimum: 0 },
    leadDays: { type: "number", minimum: 0 },
  },
  required: ["physical", "reserved", "quarantine", "dailyUse", "leadDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usable: { type: "integer" },
    coverDays: { type: "number" },
    leadGap: { type: "number" },
  },
  required: ["usable", "coverDays", "leadGap"],
} as const;
/** Calculate biosecurity protective stock day cover from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { physical, reserved, quarantine, dailyUse, leadDays } = request;
  const compute = (): Output => {
    H.integer(physical, 0);
    H.integer(reserved, 0);
    H.integer(quarantine, 0);
    H.domain(reserved + quarantine <= physical && leadDays >= 0);
    H.positive(dailyUse);
    return {
      usable: physical - reserved - quarantine,
      coverDays: (physical - reserved - quarantine) / dailyUse,
      leadGap: (physical - reserved - quarantine) / dailyUse - leadDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    physical: 100,
    reserved: 20,
    quarantine: 10,
    dailyUse: 10,
    leadDays: 5,
  },
  output: { usable: 70, coverDays: 7, leadGap: 2 },
} satisfies ToolExample<Input, Output>;
export const biosecurityProtectiveStockDayCoverTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/biosecurity-protective-stock-day-cover",
    title: "Biosecurity Protective Stock Day Cover Tool",
    description:
      "Calculate biosecurity protective stock day cover from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physical: { type: "integer", minimum: 0 },
        reserved: { type: "integer", minimum: 0 },
        quarantine: { type: "integer", minimum: 0 },
        dailyUse: { type: "number", exclusiveMinimum: 0 },
        leadDays: { type: "number", minimum: 0 },
      },
      required: ["physical", "reserved", "quarantine", "dailyUse", "leadDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usable: { type: "integer" },
        coverDays: { type: "number" },
        leadGap: { type: "number" },
      },
      required: ["usable", "coverDays", "leadGap"],
    },
    ports: {
      inputs: [
        {
          id: "physical",
          label: "Physical",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quarantine",
          label: "Quarantine",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dailyUse",
          label: "Daily Use",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leadDays",
          label: "Lead Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "usable", label: "Usable", valueType: { type: "integer" } },
        { id: "coverDays", label: "Cover Days", valueType: { type: "number" } },
        { id: "leadGap", label: "Lead Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biosecurityProtectiveStockDayCoverTool.execute;
export default biosecurityProtectiveStockDayCoverTool;
