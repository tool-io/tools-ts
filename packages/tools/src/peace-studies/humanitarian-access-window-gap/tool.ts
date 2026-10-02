import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstWindowEnd: number;
  readonly nextWindowStart: number;
};
export type Output = { readonly gap: number; readonly overlap: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstWindowEnd: { type: "number" },
    nextWindowStart: { type: "number" },
  },
  required: ["firstWindowEnd", "nextWindowStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, overlap: { type: "boolean" } },
  required: ["gap", "overlap"],
} as const;
/** Compare explicit historical or planning window coordinates without inferring safe access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstWindowEnd, nextWindowStart } = request;
  const compute = (): Output => {
    return {
      gap: nextWindowStart - firstWindowEnd,
      overlap: nextWindowStart < firstWindowEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstWindowEnd: 10, nextWindowStart: 15 },
  output: { gap: 5, overlap: false },
} satisfies ToolExample<Input, Output>;
export const humanitarianAccessWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/humanitarian-access-window-gap",
    title: "Humanitarian Access Window Gap Tool",
    description:
      "Compare explicit historical or planning window coordinates without inferring safe access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstWindowEnd: { type: "number" },
        nextWindowStart: { type: "number" },
      },
      required: ["firstWindowEnd", "nextWindowStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, overlap: { type: "boolean" } },
      required: ["gap", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "firstWindowEnd",
          label: "First Window End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextWindowStart",
          label: "Next Window Start",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = humanitarianAccessWindowGapTool.execute;
export default humanitarianAccessWindowGapTool;
