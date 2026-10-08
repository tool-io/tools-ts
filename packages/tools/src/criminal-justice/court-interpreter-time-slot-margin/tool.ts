import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slotMinutes: number;
  readonly requestedInterpreterMinutes: number;
};
export type Output = { readonly marginMinutes: number; readonly fits: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slotMinutes: { type: "number", minimum: 0 },
    requestedInterpreterMinutes: { type: "number", minimum: 0 },
  },
  required: ["slotMinutes", "requestedInterpreterMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { marginMinutes: { type: "number" }, fits: { type: "boolean" } },
  required: ["marginMinutes", "fits"],
} as const;
/** Compare an explicitly requested court-interpreter duration with an available slot without scheduling or determining language-access sufficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slotMinutes, requestedInterpreterMinutes } = request;
  const compute = (): Output => {
    H.domain(
      slotMinutes >= 0 && requestedInterpreterMinutes >= 0,
      "slotMinutes",
    );
    return {
      marginMinutes: slotMinutes - requestedInterpreterMinutes,
      fits: requestedInterpreterMinutes <= slotMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slotMinutes: 60, requestedInterpreterMinutes: 45 },
  output: { marginMinutes: 15, fits: true },
} satisfies ToolExample<Input, Output>;
export const courtInterpreterTimeSlotMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/court-interpreter-time-slot-margin",
    title: "Court Interpreter Time Slot Margin",
    description:
      "Compare an explicitly requested court-interpreter duration with an available slot without scheduling or determining language-access sufficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slotMinutes: { type: "number", minimum: 0 },
        requestedInterpreterMinutes: { type: "number", minimum: 0 },
      },
      required: ["slotMinutes", "requestedInterpreterMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginMinutes: { type: "number" },
        fits: { type: "boolean" },
      },
      required: ["marginMinutes", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "slotMinutes",
          label: "Slot Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requestedInterpreterMinutes",
          label: "Requested Interpreter Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marginMinutes",
          label: "Margin Minutes",
          valueType: { type: "number" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = courtInterpreterTimeSlotMarginTool.execute;
export default courtInterpreterTimeSlotMarginTool;
