import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPulseEnd: number;
  readonly secondPulseStart: number;
  readonly suppliedClockOffset: number;
};
export type Output = { readonly gap: number; readonly overlap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPulseEnd: { type: "number" },
    secondPulseStart: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["firstPulseEnd", "secondPulseStart", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, overlap: { type: "number" } },
  required: ["gap", "overlap"],
} as const;
/** Compare supplied research pulse timestamps without electrical stimulation or clinical guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPulseEnd, secondPulseStart, suppliedClockOffset } = request;
  const compute = (): Output => {
    return {
      gap: secondPulseStart - suppliedClockOffset - firstPulseEnd,
      overlap: Math.max(
        0,
        firstPulseEnd - secondPulseStart + suppliedClockOffset,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPulseEnd: 10, secondPulseStart: 15, suppliedClockOffset: 2 },
  output: { gap: 3, overlap: 0 },
} satisfies ToolExample<Input, Output>;
export const stimulusPulseGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "neurology/stimulus-pulse-gap",
    title: "Stimulus Pulse Gap Tool",
    description:
      "Compare supplied research pulse timestamps without electrical stimulation or clinical guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPulseEnd: { type: "number" },
        secondPulseStart: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: ["firstPulseEnd", "secondPulseStart", "suppliedClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, overlap: { type: "number" } },
      required: ["gap", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "firstPulseEnd",
          label: "First Pulse End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPulseStart",
          label: "Second Pulse Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stimulusPulseGapTool.execute;
export default stimulusPulseGapTool;
