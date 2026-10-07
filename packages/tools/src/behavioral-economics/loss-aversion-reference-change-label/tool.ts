import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outcome: number;
  readonly referenceValue: number;
};
export type Output = { readonly signedChange: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outcome: { type: "number" },
    referenceValue: { type: "number" },
  },
  required: ["outcome", "referenceValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedChange: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["signedChange", "label"],
} as const;
/** Label a supplied outcome as gain, loss or unchanged relative to an explicit reference value without estimating loss aversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outcome, referenceValue } = request;
  const compute = (): Output => {
    return {
      signedChange: outcome - referenceValue,
      label:
        outcome < referenceValue
          ? "loss"
          : outcome > referenceValue
            ? "gain"
            : "reference",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outcome: 80, referenceValue: 100 },
  output: { signedChange: -20, label: "loss" },
} satisfies ToolExample<Input, Output>;
export const lossAversionReferenceChangeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/loss-aversion-reference-change-label",
    title: "Loss Aversion Reference Change Label",
    description:
      "Label a supplied outcome as gain, loss or unchanged relative to an explicit reference value without estimating loss aversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outcome: { type: "number" },
        referenceValue: { type: "number" },
      },
      required: ["outcome", "referenceValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedChange: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["signedChange", "label"],
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
          id: "referenceValue",
          label: "Reference Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedChange",
          label: "Signed Change",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = lossAversionReferenceChangeLabelTool.execute;
export default lossAversionReferenceChangeLabelTool;
