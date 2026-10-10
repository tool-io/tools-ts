import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEndSeconds: number;
  readonly nextStartSeconds: number;
};
export type Output = {
  readonly signedGapSeconds: number;
  readonly overlap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEndSeconds: { type: "number" },
    nextStartSeconds: { type: "number" },
  },
  required: ["previousEndSeconds", "nextStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGapSeconds: { type: "number" },
    overlap: { type: "boolean" },
  },
  required: ["signedGapSeconds", "overlap"],
} as const;
/** Compare explicitly supplied neonatal monitor recording endpoints without interpreting physiology during a gap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEndSeconds, nextStartSeconds } = request;
  const compute = (): Output => {
    return {
      signedGapSeconds: nextStartSeconds - previousEndSeconds,
      overlap: nextStartSeconds < previousEndSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousEndSeconds: 100, nextStartSeconds: 115 },
  output: { signedGapSeconds: 15, overlap: false },
} satisfies ToolExample<Input, Output>;
export const neonatalMonitorRecordingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neonatology", "health and medicine"],
      keywords: ["neonatology", "health and medicine"],
    },
    id: "neonatology/neonatal-monitor-recording-gap",
    title: "Neonatal Monitor Recording Gap",
    description:
      "Compare explicitly supplied neonatal monitor recording endpoints without interpreting physiology during a gap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousEndSeconds: { type: "number" },
        nextStartSeconds: { type: "number" },
      },
      required: ["previousEndSeconds", "nextStartSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGapSeconds: { type: "number" },
        overlap: { type: "boolean" },
      },
      required: ["signedGapSeconds", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "previousEndSeconds",
          label: "Previous End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStartSeconds",
          label: "Next Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedGapSeconds",
          label: "Signed Gap Seconds",
          valueType: { type: "number" },
        },
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = neonatalMonitorRecordingGapTool.execute;
export default neonatalMonitorRecordingGapTool;
