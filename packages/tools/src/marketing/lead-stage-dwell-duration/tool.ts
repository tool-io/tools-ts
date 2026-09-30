import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly enteredAt: number;
  readonly leftAt: number;
  readonly excludedTime: number;
};
export type Output = { readonly dwell: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enteredAt: { type: "number" },
    leftAt: { type: "number" },
    excludedTime: { type: "number", minimum: 0 },
  },
  required: ["enteredAt", "leftAt", "excludedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dwell: { type: "number" } },
  required: ["dwell"],
} as const;
/** Calculate lead stage dwell duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { enteredAt, leftAt, excludedTime } = request;
  const compute = (): Output => {
    H.domain(
      leftAt >= enteredAt &&
        excludedTime >= 0 &&
        excludedTime <= leftAt - enteredAt,
    );
    return { dwell: leftAt - enteredAt - excludedTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { enteredAt: 10, leftAt: 40, excludedTime: 5 },
  output: { dwell: 25 },
} satisfies ToolExample<Input, Output>;
export const leadStageDwellDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/lead-stage-dwell-duration",
    title: "Lead Stage Dwell Duration Tool",
    description:
      "Calculate lead stage dwell duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enteredAt: { type: "number" },
        leftAt: { type: "number" },
        excludedTime: { type: "number", minimum: 0 },
      },
      required: ["enteredAt", "leftAt", "excludedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dwell: { type: "number" } },
      required: ["dwell"],
    },
    ports: {
      inputs: [
        {
          id: "enteredAt",
          label: "Entered At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftAt",
          label: "Left At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedTime",
          label: "Excluded Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "dwell", label: "Dwell", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = leadStageDwellDurationTool.execute;
export default leadStageDwellDurationTool;
