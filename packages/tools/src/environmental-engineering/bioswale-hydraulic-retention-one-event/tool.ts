import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly storageVolume: number;
  readonly eventFlow: number;
  readonly infiltrationFlow: number;
};
export type Output = {
  readonly totalOutflow: number;
  readonly nominalResidence: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storageVolume: { type: "number", minimum: 0 },
    eventFlow: { type: "number", minimum: 0 },
    infiltrationFlow: { type: "number", minimum: 0 },
  },
  required: ["storageVolume", "eventFlow", "infiltrationFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalOutflow: { type: "number" },
    nominalResidence: { type: "number" },
  },
  required: ["totalOutflow", "nominalResidence"],
} as const;
/** Nominal V/Q residence using constant combined outflow; this is not a routed storm hydrograph. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storageVolume, eventFlow, infiltrationFlow } = request;
  const compute = (): Output => {
    H.domain(
      storageVolume >= 0 &&
        eventFlow >= 0 &&
        infiltrationFlow >= 0 &&
        eventFlow + infiltrationFlow > 0,
    );
    return {
      totalOutflow: eventFlow + infiltrationFlow,
      nominalResidence: storageVolume / (eventFlow + infiltrationFlow),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storageVolume: 100, eventFlow: 5, infiltrationFlow: 5 },
  output: { totalOutflow: 10, nominalResidence: 10 },
} satisfies ToolExample<Input, Output>;
export const bioswaleHydraulicRetentionOneEventTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/bioswale-hydraulic-retention-one-event",
    title: "Bioswale Hydraulic Retention One Event Tool",
    description:
      "Nominal V/Q residence using constant combined outflow; this is not a routed storm hydrograph.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storageVolume: { type: "number", minimum: 0 },
        eventFlow: { type: "number", minimum: 0 },
        infiltrationFlow: { type: "number", minimum: 0 },
      },
      required: ["storageVolume", "eventFlow", "infiltrationFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalOutflow: { type: "number" },
        nominalResidence: { type: "number" },
      },
      required: ["totalOutflow", "nominalResidence"],
    },
    ports: {
      inputs: [
        {
          id: "storageVolume",
          label: "Storage Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventFlow",
          label: "Event Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "infiltrationFlow",
          label: "Infiltration Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalOutflow",
          label: "Total Outflow",
          valueType: { type: "number" },
        },
        {
          id: "nominalResidence",
          label: "Nominal Residence",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bioswaleHydraulicRetentionOneEventTool.execute;
export default bioswaleHydraulicRetentionOneEventTool;
