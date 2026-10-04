import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly suppliedClockShift: number;
};
export type Output = { readonly gap: number; readonly overlaps: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEnd: { type: "number" },
    secondStart: { type: "number" },
    suppliedClockShift: { type: "number" },
  },
  required: ["firstEnd", "secondStart", "suppliedClockShift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, overlaps: { type: "boolean" } },
  required: ["gap", "overlaps"],
} as const;
/** Compare supplied diary interval boundaries in a common clock basis without inferring voiding function. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEnd, secondStart, suppliedClockShift } = request;
  const compute = (): Output => {
    return {
      gap: secondStart + suppliedClockShift - firstEnd,
      overlaps: secondStart + suppliedClockShift < firstEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstEnd: 10, secondStart: 15, suppliedClockShift: -2 },
  output: { gap: 3, overlaps: false },
} satisfies ToolExample<Input, Output>;
export const voidingDiaryIntervalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/voiding-diary-interval-gap",
    title: "Voiding Diary Interval Gap Tool",
    description:
      "Compare supplied diary interval boundaries in a common clock basis without inferring voiding function.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEnd: { type: "number" },
        secondStart: { type: "number" },
        suppliedClockShift: { type: "number" },
      },
      required: ["firstEnd", "secondStart", "suppliedClockShift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, overlaps: { type: "boolean" } },
      required: ["gap", "overlaps"],
    },
    ports: {
      inputs: [
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockShift",
          label: "Supplied Clock Shift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "overlaps", label: "Overlaps", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = voidingDiaryIntervalGapTool.execute;
export default voidingDiaryIntervalGapTool;
