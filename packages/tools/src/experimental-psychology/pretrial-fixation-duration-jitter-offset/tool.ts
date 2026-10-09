import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseDuration: number;
  readonly suppliedJitter: number;
};
export type Output = { readonly fixationDuration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseDuration: { type: "number", minimum: 0 },
    suppliedJitter: { type: "number" },
  },
  required: ["baseDuration", "suppliedJitter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fixationDuration: { type: "number" } },
  required: ["fixationDuration"],
} as const;
/** Add an explicitly supplied signed fixation-duration jitter, requiring a nonnegative resulting duration without generating randomness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseDuration, suppliedJitter } = request;
  const compute = (): Output => {
    H.domain(baseDuration >= 0, "baseDuration");
    H.domain(baseDuration + suppliedJitter >= 0, "suppliedJitter");
    return { fixationDuration: baseDuration + suppliedJitter };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseDuration: 500, suppliedJitter: 50 },
  output: { fixationDuration: 550 },
} satisfies ToolExample<Input, Output>;
export const pretrialFixationDurationJitterOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "experimental-psychology/pretrial-fixation-duration-jitter-offset",
      title: "Pretrial Fixation Duration Jitter Offset Tool",
      description:
        "Add an explicitly supplied signed fixation-duration jitter, requiring a nonnegative resulting duration without generating randomness.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseDuration: { type: "number", minimum: 0 },
          suppliedJitter: { type: "number" },
        },
        required: ["baseDuration", "suppliedJitter"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { fixationDuration: { type: "number" } },
        required: ["fixationDuration"],
      },
      ports: {
        inputs: [
          {
            id: "baseDuration",
            label: "Base Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedJitter",
            label: "Supplied Jitter",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fixationDuration",
            label: "Fixation Duration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pretrialFixationDurationJitterOffsetTool.execute;
export default pretrialFixationDurationJitterOffsetTool;
