import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEnd: number;
  readonly nextStart: number;
};
export type Output = { readonly overlap: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEnd: { type: "number" },
    nextStart: { type: "number" },
  },
  required: ["previousEnd", "nextStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "number" }, gap: { type: "number" } },
  required: ["overlap", "gap"],
} as const;
/** Calculate speech turn transition overlap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEnd, nextStart } = request;
  const compute = (): Output => {
    return {
      overlap: Math.max(0, previousEnd - nextStart),
      gap: Math.max(0, nextStart - previousEnd),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousEnd: 10, nextStart: 8 },
  output: { overlap: 2, gap: 0 },
} satisfies ToolExample<Input, Output>;
export const speechTurnTransitionOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/speech-turn-transition-overlap",
    title: "Speech Turn Transition Overlap Tool",
    description:
      "Calculate speech turn transition overlap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousEnd: { type: "number" },
        nextStart: { type: "number" },
      },
      required: ["previousEnd", "nextStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlap: { type: "number" }, gap: { type: "number" } },
      required: ["overlap", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "previousEnd",
          label: "Previous End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStart",
          label: "Next Start",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = speechTurnTransitionOverlapTool.execute;
export default speechTurnTransitionOverlapTool;
