import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEvent: number;
  readonly nextEvent: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEvent: { type: "number" },
    nextEvent: { type: "number" },
  },
  required: ["previousEvent", "nextEvent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare supplied diary timestamps without inferring a clinical frequency threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEvent, nextEvent } = request;
  const compute = (): Output => {
    return { gap: nextEvent - previousEvent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousEvent: 10, nextEvent: 25 },
  output: { gap: 15 },
} satisfies ToolExample<Input, Output>;
export const bladderDiaryTimeGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "urology/bladder-diary-time-gap",
      title: "Bladder Diary Time Gap Tool",
      description:
        "Compare supplied diary timestamps without inferring a clinical frequency threshold.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          previousEvent: { type: "number" },
          nextEvent: { type: "number" },
        },
        required: ["previousEvent", "nextEvent"],
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
            id: "previousEvent",
            label: "Previous Event",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nextEvent",
            label: "Next Event",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
      },
    },
    calculate,
  },
);
export const run = bladderDiaryTimeGapTool.execute;
export default bladderDiaryTimeGapTool;
