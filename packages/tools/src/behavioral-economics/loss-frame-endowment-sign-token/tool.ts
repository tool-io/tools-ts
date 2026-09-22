import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly outcome: number; readonly endowment: number };
export type Output = { readonly difference: number; readonly frame: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outcome: { type: "number" }, endowment: { type: "number" } },
  required: ["outcome", "endowment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    frame: { type: "string", maxLength: 8192 },
  },
  required: ["difference", "frame"],
} as const;
/** Classify an outcome relative to an explicitly supplied endowment; no utility or behavior is predicted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outcome, endowment } = request;
  const compute = (): Output => {
    const difference = outcome - endowment;
    return {
      difference,
      frame: difference < 0 ? "loss" : difference > 0 ? "gain" : "unchanged",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outcome: 80, endowment: 100 },
  output: { difference: -20, frame: "loss" },
} satisfies ToolExample<Input, Output>;
export const lossFrameEndowmentSignTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/loss-frame-endowment-sign-token",
    title: "Loss Frame Endowment Sign Token Tool",
    description:
      "Classify an outcome relative to an explicitly supplied endowment; no utility or behavior is predicted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outcome: { type: "number" },
        endowment: { type: "number" },
      },
      required: ["outcome", "endowment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        frame: { type: "string", maxLength: 8192 },
      },
      required: ["difference", "frame"],
    },
    ports: {
      inputs: [
        {
          id: "outcome",
          label: "Outcome",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endowment",
          label: "Endowment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        { id: "frame", label: "Frame", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = lossFrameEndowmentSignTokenTool.execute;
export default lossFrameEndowmentSignTokenTool;
