import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly onset: number; readonly offset: number };
export type Output = { readonly duration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { onset: { type: "number" }, offset: { type: "number" } },
  required: ["onset", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { duration: { type: "number" } },
  required: ["duration"],
} as const;
/** Calculate a nonnegative observed behavior duration from supplied monotonic onset and offset timestamps. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onset, offset } = request;
  const compute = (): Output => {
    H.domain(offset >= onset, "offset");
    return { duration: offset - onset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onset: 12, offset: 18 },
  output: { duration: 6 },
} satisfies ToolExample<Input, Output>;
export const observationOnsetOffsetDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/observation-onset-offset-duration",
    title: "Observation Onset Offset Duration",
    description:
      "Calculate a nonnegative observed behavior duration from supplied monotonic onset and offset timestamps.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { onset: { type: "number" }, offset: { type: "number" } },
      required: ["onset", "offset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { duration: { type: "number" } },
      required: ["duration"],
    },
    ports: {
      inputs: [
        {
          id: "onset",
          label: "Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "duration", label: "Duration", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = observationOnsetOffsetDurationTool.execute;
export default observationOnsetOffsetDurationTool;
