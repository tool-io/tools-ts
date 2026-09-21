import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effect: number;
  readonly suppliedNull: number;
  readonly higherFavoursExperimental: boolean;
};
export type Output = { readonly direction: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effect: { type: "number" },
    suppliedNull: { type: "number" },
    higherFavoursExperimental: { type: "boolean" },
  },
  required: ["effect", "suppliedNull", "higherFavoursExperimental"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { direction: { type: "string", maxLength: 8192 } },
  required: ["direction"],
} as const;
/** Label the direction of a supplied research effect under an explicit favorability convention; no strength-of-evidence conclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effect, suppliedNull, higherFavoursExperimental } = request;
  const compute = (): Output => {
    return {
      direction:
        effect === suppliedNull
          ? "at-null"
          : effect > suppliedNull === higherFavoursExperimental
            ? "experimental"
            : "comparator",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effect: 2, suppliedNull: 0, higherFavoursExperimental: true },
  output: { direction: "experimental" },
} satisfies ToolExample<Input, Output>;
export const evidenceBranchDirectionMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/evidence-branch-direction-marker",
    title: "Evidence Branch Direction Marker Tool",
    description:
      "Label the direction of a supplied research effect under an explicit favorability convention; no strength-of-evidence conclusion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effect: { type: "number" },
        suppliedNull: { type: "number" },
        higherFavoursExperimental: { type: "boolean" },
      },
      required: ["effect", "suppliedNull", "higherFavoursExperimental"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { direction: { type: "string", maxLength: 8192 } },
      required: ["direction"],
    },
    ports: {
      inputs: [
        {
          id: "effect",
          label: "Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedNull",
          label: "Supplied Null",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "higherFavoursExperimental",
          label: "Higher Favours Experimental",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "direction", label: "Direction", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = evidenceBranchDirectionMarkerTool.execute;
export default evidenceBranchDirectionMarkerTool;
