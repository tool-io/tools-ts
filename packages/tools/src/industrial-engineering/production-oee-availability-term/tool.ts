import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedProductionMinutes: number;
  readonly downtimeMinutes: number;
};
export type Output = {
  readonly operatingMinutes: number;
  readonly availability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedProductionMinutes: { type: "number", exclusiveMinimum: 0 },
    downtimeMinutes: { type: "number", minimum: 0 },
  },
  required: ["plannedProductionMinutes", "downtimeMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    operatingMinutes: { type: "number" },
    availability: { type: "number" },
  },
  required: ["operatingMinutes", "availability"],
} as const;
/** Calculate only the availability component of OEE from explicit planned production time and downtime. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedProductionMinutes, downtimeMinutes } = request;
  const compute = (): Output => {
    (H.domain(plannedProductionMinutes > 0, "plannedProductionMinutes"),
      plannedProductionMinutes);
    H.domain(
      downtimeMinutes >= 0 && downtimeMinutes <= plannedProductionMinutes,
      "downtimeMinutes",
    );
    return {
      operatingMinutes: plannedProductionMinutes - downtimeMinutes,
      availability:
        (plannedProductionMinutes - downtimeMinutes) / plannedProductionMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedProductionMinutes: 400, downtimeMinutes: 40 },
  output: { operatingMinutes: 360, availability: 0.9 },
} satisfies ToolExample<Input, Output>;
export const productionOeeAvailabilityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "industrial-engineering",
        "industrial engineering",
        "engineering",
      ],
      keywords: ["industrial engineering", "engineering"],
    },
    id: "industrial-engineering/production-oee-availability-term",
    title: "Production OEE Availability Term",
    description:
      "Calculate only the availability component of OEE from explicit planned production time and downtime.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedProductionMinutes: { type: "number", exclusiveMinimum: 0 },
        downtimeMinutes: { type: "number", minimum: 0 },
      },
      required: ["plannedProductionMinutes", "downtimeMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        operatingMinutes: { type: "number" },
        availability: { type: "number" },
      },
      required: ["operatingMinutes", "availability"],
    },
    ports: {
      inputs: [
        {
          id: "plannedProductionMinutes",
          label: "Planned Production Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "downtimeMinutes",
          label: "Downtime Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "operatingMinutes",
          label: "Operating Minutes",
          valueType: { type: "number" },
        },
        {
          id: "availability",
          label: "Availability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = productionOeeAvailabilityTermTool.execute;
export default productionOeeAvailabilityTermTool;
