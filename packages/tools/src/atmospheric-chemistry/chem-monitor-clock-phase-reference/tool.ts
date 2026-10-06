import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly monitorId: string;
  readonly phaseText: string;
  readonly clockReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    monitorId: { type: "string", maxLength: 8192, minLength: 1 },
    phaseText: { type: "string", maxLength: 8192, minLength: 1 },
    clockReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["monitorId", "phaseText", "clockReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a chemistry-monitor phase transcription and explicit clock reference without inferring time zone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { monitorId, phaseText, clockReference } = request;
  const compute = (): Output => {
    H.domain(monitorId.length > 0, "monitorId");
    H.domain(phaseText.length > 0, "phaseText");
    H.domain(clockReference.length > 0, "clockReference");
    return { token: JSON.stringify([monitorId, phaseText, clockReference]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { monitorId: "M17", phaseText: "00:15", clockReference: "UTC" },
  output: { token: '["M17","00:15","UTC"]' },
} satisfies ToolExample<Input, Output>;
export const chemMonitorClockPhaseReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/chem-monitor-clock-phase-reference",
    title: "Chem Monitor Clock Phase Reference",
    description:
      "Preserve a chemistry-monitor phase transcription and explicit clock reference without inferring time zone.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        monitorId: { type: "string", maxLength: 8192, minLength: 1 },
        phaseText: { type: "string", maxLength: 8192, minLength: 1 },
        clockReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["monitorId", "phaseText", "clockReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "monitorId",
          label: "Monitor Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "phaseText",
          label: "Phase Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "clockReference",
          label: "Clock Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = chemMonitorClockPhaseReferenceTool.execute;
export default chemMonitorClockPhaseReferenceTool;
