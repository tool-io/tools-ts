import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly avoidableIfCancelled: boolean;
  readonly alreadyIncurred: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    avoidableIfCancelled: { type: "boolean" },
    alreadyIncurred: { type: "boolean" },
  },
  required: ["avoidableIfCancelled", "alreadyIncurred"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Classify an explicitly described cost by incurred and avoidable flags; this is a bookkeeping convention rather than a determination from a cost description. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { avoidableIfCancelled, alreadyIncurred } = request;
  const compute = (): Output => {
    return {
      label:
        alreadyIncurred && !avoidableIfCancelled
          ? "sunk"
          : avoidableIfCancelled
            ? "avoidable-incremental"
            : "unavoidable-future",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { avoidableIfCancelled: false, alreadyIncurred: true },
  output: { label: "sunk" },
} satisfies ToolExample<Input, Output>;
export const sunkVsIncrementalCostLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/sunk-vs-incremental-cost-label",
    title: "Sunk Vs Incremental Cost Label Tool",
    description:
      "Classify an explicitly described cost by incurred and avoidable flags; this is a bookkeeping convention rather than a determination from a cost description.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        avoidableIfCancelled: { type: "boolean" },
        alreadyIncurred: { type: "boolean" },
      },
      required: ["avoidableIfCancelled", "alreadyIncurred"],
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
          id: "avoidableIfCancelled",
          label: "Avoidable If Cancelled",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "alreadyIncurred",
          label: "Already Incurred",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sunkVsIncrementalCostLabelTool.execute;
export default sunkVsIncrementalCostLabelTool;
