import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startMinutes: number;
  readonly endMinutes: number;
  readonly interruptionMinutes: number;
};
export type Output = {
  readonly elapsedMinutes: number;
  readonly activeMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startMinutes: { type: "number" },
    endMinutes: { type: "number" },
    interruptionMinutes: { type: "number", minimum: 0 },
  },
  required: ["startMinutes", "endMinutes", "interruptionMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedMinutes: { type: "number" },
    activeMinutes: { type: "number" },
  },
  required: ["elapsedMinutes", "activeMinutes"],
} as const;
/** Subtract explicit nonoverlapping interruptions from a recorded session interval without assessing dialysis dose or adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startMinutes, endMinutes, interruptionMinutes } = request;
  const compute = (): Output => {
    H.domain(
      endMinutes >= startMinutes &&
        interruptionMinutes >= 0 &&
        interruptionMinutes <= endMinutes - startMinutes,
      "endMinutes",
    );
    return {
      elapsedMinutes: endMinutes - startMinutes,
      activeMinutes: endMinutes - startMinutes - interruptionMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startMinutes: 480, endMinutes: 720, interruptionMinutes: 15 },
  output: { elapsedMinutes: 240, activeMinutes: 225 },
} satisfies ToolExample<Input, Output>;
export const dialysisActualSessionDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nephrology", "health and medicine"],
      keywords: ["nephrology", "health and medicine"],
    },
    id: "nephrology/dialysis-actual-session-duration",
    title: "Dialysis Actual Session Duration",
    description:
      "Subtract explicit nonoverlapping interruptions from a recorded session interval without assessing dialysis dose or adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startMinutes: { type: "number" },
        endMinutes: { type: "number" },
        interruptionMinutes: { type: "number", minimum: 0 },
      },
      required: ["startMinutes", "endMinutes", "interruptionMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedMinutes: { type: "number" },
        activeMinutes: { type: "number" },
      },
      required: ["elapsedMinutes", "activeMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "startMinutes",
          label: "Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endMinutes",
          label: "End Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interruptionMinutes",
          label: "Interruption Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          valueType: { type: "number" },
        },
        {
          id: "activeMinutes",
          label: "Active Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialysisActualSessionDurationTool.execute;
export default dialysisActualSessionDurationTool;
