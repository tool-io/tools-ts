import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableMinutes: number;
  readonly requiredMinutes: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMinutes: { type: "number", minimum: 0 },
    requiredMinutes: { type: "number", minimum: 0 },
  },
  required: ["availableMinutes", "requiredMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Calculate study session availability gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableMinutes, requiredMinutes } = request;
  const compute = (): Output => {
    H.domain(availableMinutes >= 0 && requiredMinutes >= 0);
    return { gap: availableMinutes - requiredMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableMinutes: 90, requiredMinutes: 60 },
  output: { gap: 30 },
} satisfies ToolExample<Input, Output>;
export const studySessionAvailabilityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/study-session-availability-gap",
    title: "Study Session Availability Gap Tool",
    description:
      "Calculate study session availability gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMinutes: { type: "number", minimum: 0 },
        requiredMinutes: { type: "number", minimum: 0 },
      },
      required: ["availableMinutes", "requiredMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "availableMinutes",
          label: "Available Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredMinutes",
          label: "Required Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = studySessionAvailabilityGapTool.execute;
export default studySessionAvailabilityGapTool;
