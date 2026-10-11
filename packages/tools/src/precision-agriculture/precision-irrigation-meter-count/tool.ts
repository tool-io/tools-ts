import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousPulseCount: number;
  readonly currentPulseCount: number;
  readonly volumePerPulse: number;
};
export type Output = {
  readonly pulseIncrement: number;
  readonly meteredVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousPulseCount: { type: "integer", minimum: 0 },
    currentPulseCount: { type: "integer" },
    volumePerPulse: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["previousPulseCount", "currentPulseCount", "volumePerPulse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pulseIncrement: { type: "integer" },
    meteredVolume: { type: "number" },
  },
  required: ["pulseIncrement", "meteredVolume"],
} as const;
/** Convert an explicit monotone pulse-count increment using a supplied volume per pulse without inferring resets or irrigation needs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousPulseCount, currentPulseCount, volumePerPulse } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousPulseCount) &&
        previousPulseCount >= 0 &&
        previousPulseCount <= Number.MAX_SAFE_INTEGER,
      "previousPulseCount",
    ),
      previousPulseCount);
    (H.domain(
      Number.isSafeInteger(currentPulseCount) &&
        currentPulseCount >= previousPulseCount &&
        currentPulseCount <= Number.MAX_SAFE_INTEGER,
      "currentPulseCount",
    ),
      currentPulseCount);
    (H.domain(volumePerPulse > 0, "volumePerPulse"), volumePerPulse);
    return {
      pulseIncrement: currentPulseCount - previousPulseCount,
      meteredVolume: (currentPulseCount - previousPulseCount) * volumePerPulse,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousPulseCount: 100, currentPulseCount: 125, volumePerPulse: 2 },
  output: { pulseIncrement: 25, meteredVolume: 50 },
} satisfies ToolExample<Input, Output>;
export const precisionIrrigationMeterCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["precision-agriculture", "precision agriculture", "agriculture"],
      keywords: ["precision agriculture", "agriculture"],
    },
    id: "precision-agriculture/precision-irrigation-meter-count",
    title: "Precision Irrigation Meter Count",
    description:
      "Convert an explicit monotone pulse-count increment using a supplied volume per pulse without inferring resets or irrigation needs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousPulseCount: { type: "integer", minimum: 0 },
        currentPulseCount: { type: "integer" },
        volumePerPulse: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["previousPulseCount", "currentPulseCount", "volumePerPulse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pulseIncrement: { type: "integer" },
        meteredVolume: { type: "number" },
      },
      required: ["pulseIncrement", "meteredVolume"],
    },
    ports: {
      inputs: [
        {
          id: "previousPulseCount",
          label: "Previous Pulse Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "currentPulseCount",
          label: "Current Pulse Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "volumePerPulse",
          label: "Volume Per Pulse",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pulseIncrement",
          label: "Pulse Increment",
          valueType: { type: "integer" },
        },
        {
          id: "meteredVolume",
          label: "Metered Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = precisionIrrigationMeterCountTool.execute;
export default precisionIrrigationMeterCountTool;
