import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurementId: string;
  readonly posture: string;
};
export type Output = { readonly recordLabel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurementId: { type: "string", maxLength: 8192 },
    posture: {
      type: "string",
      maxLength: 8192,
      enum: ["seated", "standing", "supine", "prone", "other", "unknown"],
    },
  },
  required: ["measurementId", "posture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recordLabel: { type: "string", maxLength: 8192 } },
  required: ["recordLabel"],
} as const;
/** Attach an explicit posture field to a measurement identifier without inferring posture or interpreting the reading. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurementId, posture } = request;
  const compute = (): Output => {
    H.domain(measurementId.trim().length > 0, "measurementId");
    H.domain(
      ["seated", "standing", "supine", "prone", "other", "unknown"].includes(
        posture,
      ),
      "posture",
    );
    return { recordLabel: measurementId + " [posture=" + posture + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measurementId: "BP-12", posture: "seated" },
  output: { recordLabel: "BP-12 [posture=seated]" },
} satisfies ToolExample<Input, Output>;
export const healthLogMeasurementPostureFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/health-log-measurement-posture-field",
    title: "Health Log Measurement Posture Field Tool",
    description:
      "Attach an explicit posture field to a measurement identifier without inferring posture or interpreting the reading.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measurementId: { type: "string", maxLength: 8192 },
        posture: {
          type: "string",
          maxLength: 8192,
          enum: ["seated", "standing", "supine", "prone", "other", "unknown"],
        },
      },
      required: ["measurementId", "posture"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recordLabel: { type: "string", maxLength: 8192 } },
      required: ["recordLabel"],
    },
    ports: {
      inputs: [
        {
          id: "measurementId",
          label: "Measurement Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "posture",
          label: "Posture",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recordLabel",
          label: "Record Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthLogMeasurementPostureFieldTool.execute;
export default healthLogMeasurementPostureFieldTool;
