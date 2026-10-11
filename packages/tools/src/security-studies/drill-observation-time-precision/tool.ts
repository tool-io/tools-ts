import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly suppliedTimestampText: string;
  readonly precisionLabel: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTimestampText: { type: "string", maxLength: 8192, minLength: 1 },
    precisionLabel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "suppliedTimestampText", "precisionLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify explicit drill observation timestamp text by reported precision without reconstructing missing time components. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, suppliedTimestampText, precisionLabel } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(suppliedTimestampText.length > 0, "suppliedTimestampText");
    H.domain(precisionLabel.length > 0, "precisionLabel");
    return {
      token: JSON.stringify([
        observationId,
        suppliedTimestampText,
        precisionLabel,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    suppliedTimestampText: "2026-11-01",
    precisionLabel: "day",
  },
  output: { token: '["O17","2026-11-01","day"]' },
} satisfies ToolExample<Input, Output>;
export const drillObservationTimePrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["security-studies", "security studies", "social sciences"],
      keywords: ["security studies", "social sciences"],
    },
    id: "security-studies/drill-observation-time-precision",
    title: "Drill Observation Time Precision",
    description:
      "Qualify explicit drill observation timestamp text by reported precision without reconstructing missing time components.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTimestampText: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        precisionLabel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationId", "suppliedTimestampText", "precisionLabel"],
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
          id: "observationId",
          label: "Observation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTimestampText",
          label: "Supplied Timestamp Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precisionLabel",
          label: "Precision Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = drillObservationTimePrecisionTool.execute;
export default drillObservationTimePrecisionTool;
