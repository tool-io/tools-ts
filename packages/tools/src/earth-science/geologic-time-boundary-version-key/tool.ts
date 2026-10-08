import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly boundaryId: string;
  readonly timeScaleVersion: string;
  readonly sourceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundaryId: { type: "string", maxLength: 8192, minLength: 1 },
    timeScaleVersion: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["boundaryId", "timeScaleVersion", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit geologic time-boundary identifier and time-scale source version without supplying ages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { boundaryId, timeScaleVersion, sourceId } = request;
  const compute = (): Output => {
    H.domain(boundaryId.length > 0, "boundaryId");
    H.domain(timeScaleVersion.length > 0, "timeScaleVersion");
    H.domain(sourceId.length > 0, "sourceId");
    return { token: JSON.stringify([boundaryId, timeScaleVersion, sourceId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { boundaryId: "B17", timeScaleVersion: "v2025", sourceId: "S4" },
  output: { token: '["B17","v2025","S4"]' },
} satisfies ToolExample<Input, Output>;
export const geologicTimeBoundaryVersionKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/geologic-time-boundary-version-key",
    title: "Geologic Time Boundary Version Key Tool",
    description:
      "Record an explicit geologic time-boundary identifier and time-scale source version without supplying ages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boundaryId: { type: "string", maxLength: 8192, minLength: 1 },
        timeScaleVersion: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["boundaryId", "timeScaleVersion", "sourceId"],
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
          id: "boundaryId",
          label: "Boundary Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "timeScaleVersion",
          label: "Time Scale Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = geologicTimeBoundaryVersionKeyTool.execute;
export default geologicTimeBoundaryVersionKeyTool;
