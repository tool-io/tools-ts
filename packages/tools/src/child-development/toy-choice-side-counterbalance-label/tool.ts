import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly trialId: string; readonly assignedSide: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialId: { type: "string", maxLength: 8192, minLength: 1 },
    assignedSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "center"],
    },
  },
  required: ["trialId", "assignedSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record a caller-assigned toy location for a study trial without generating random assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialId, assignedSide } = request;
  const compute = (): Output => {
    H.domain(trialId.length > 0, "trialId");
    H.domain(
      ["left", "right", "center"].includes(assignedSide),
      "assignedSide",
    );
    return { label: trialId + " [" + assignedSide + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trialId: "T17", assignedSide: "left" },
  output: { label: "T17 [left]" },
} satisfies ToolExample<Input, Output>;
export const toyChoiceSideCounterbalanceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/toy-choice-side-counterbalance-label",
    title: "Toy Choice Side Counterbalance Label",
    description:
      "Record a caller-assigned toy location for a study trial without generating random assignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialId: { type: "string", maxLength: 8192, minLength: 1 },
        assignedSide: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "center"],
        },
      },
      required: ["trialId", "assignedSide"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "trialId",
          label: "Trial Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignedSide",
          label: "Assigned Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = toyChoiceSideCounterbalanceLabelTool.execute;
export default toyChoiceSideCounterbalanceLabelTool;
