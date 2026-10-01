import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly breakStart: number;
  readonly breakEnd: number;
  readonly requiredDuration: number;
};
export type Output = { readonly duration: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    breakStart: { type: "number" },
    breakEnd: { type: "number" },
    requiredDuration: { type: "number", minimum: 0 },
  },
  required: ["breakStart", "breakEnd", "requiredDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { duration: { type: "number" }, gap: { type: "number" } },
  required: ["duration", "gap"],
} as const;
/** Calculate shift break window gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { breakStart, breakEnd, requiredDuration } = request;
  const compute = (): Output => {
    H.domain(breakEnd >= breakStart && requiredDuration >= 0);
    return {
      duration: breakEnd - breakStart,
      gap: breakEnd - breakStart - requiredDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { breakStart: 10, breakEnd: 25, requiredDuration: 20 },
  output: { duration: 15, gap: -5 },
} satisfies ToolExample<Input, Output>;
export const shiftBreakWindowGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "occupational-health/shift-break-window-gap",
      title: "Shift Break Window Gap Tool",
      description:
        "Calculate shift break window gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          breakStart: { type: "number" },
          breakEnd: { type: "number" },
          requiredDuration: { type: "number", minimum: 0 },
        },
        required: ["breakStart", "breakEnd", "requiredDuration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { duration: { type: "number" }, gap: { type: "number" } },
        required: ["duration", "gap"],
      },
      ports: {
        inputs: [
          {
            id: "breakStart",
            label: "Break Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "breakEnd",
            label: "Break End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "requiredDuration",
            label: "Required Duration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "duration", label: "Duration", valueType: { type: "number" } },
          { id: "gap", label: "Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = shiftBreakWindowGapTool.execute;
export default shiftBreakWindowGapTool;
