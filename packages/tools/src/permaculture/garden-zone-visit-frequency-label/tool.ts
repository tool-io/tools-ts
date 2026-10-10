import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zoneId: string;
  readonly recordedVisits: number;
  readonly observationDays: number;
};
export type Output = { readonly visitsPerDay: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zoneId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedVisits: { type: "integer", minimum: 0 },
    observationDays: { type: "integer", minimum: 1 },
  },
  required: ["zoneId", "recordedVisits", "observationDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitsPerDay: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["visitsPerDay", "label"],
} as const;
/** Normalize explicit recorded zone visits to observation days without assigning a permaculture zone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zoneId, recordedVisits, observationDays } = request;
  const compute = (): Output => {
    H.domain(zoneId.length > 0, "zoneId");
    (H.domain(
      Number.isSafeInteger(recordedVisits) &&
        recordedVisits >= 0 &&
        recordedVisits <= Number.MAX_SAFE_INTEGER,
      "recordedVisits",
    ),
      recordedVisits);
    (H.domain(
      Number.isSafeInteger(observationDays) &&
        observationDays >= 1 &&
        observationDays <= Number.MAX_SAFE_INTEGER,
      "observationDays",
    ),
      observationDays);
    return {
      visitsPerDay: recordedVisits / observationDays,
      label:
        zoneId +
        "; " +
        recordedVisits +
        " visits / " +
        observationDays +
        " days",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zoneId: "ZONE17", recordedVisits: 14, observationDays: 7 },
  output: { visitsPerDay: 2, label: "ZONE17; 14 visits / 7 days" },
} satisfies ToolExample<Input, Output>;
export const gardenZoneVisitFrequencyLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["permaculture", "agriculture"],
      keywords: ["permaculture", "agriculture"],
    },
    id: "permaculture/garden-zone-visit-frequency-label",
    title: "Garden Zone Visit Frequency Label",
    description:
      "Normalize explicit recorded zone visits to observation days without assigning a permaculture zone.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zoneId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedVisits: { type: "integer", minimum: 0 },
        observationDays: { type: "integer", minimum: 1 },
      },
      required: ["zoneId", "recordedVisits", "observationDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitsPerDay: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["visitsPerDay", "label"],
    },
    ports: {
      inputs: [
        {
          id: "zoneId",
          label: "Zone Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedVisits",
          label: "Recorded Visits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationDays",
          label: "Observation Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "visitsPerDay",
          label: "Visits Per Day",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gardenZoneVisitFrequencyLabelTool.execute;
export default gardenZoneVisitFrequencyLabelTool;
