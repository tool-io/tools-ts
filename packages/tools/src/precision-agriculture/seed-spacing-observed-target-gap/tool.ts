import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetSpacing: number;
  readonly observedSpacing: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetSpacing: { type: "number" },
    observedSpacing: { type: "number" },
  },
  required: ["targetSpacing", "observedSpacing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicitly supplied target seed spacing from observed spacing on compatible units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetSpacing, observedSpacing } = request;
  const compute = (): Output => {
    return { signedGap: observedSpacing - targetSpacing };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetSpacing: 12, observedSpacing: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const seedSpacingObservedTargetGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["precision-agriculture", "precision agriculture", "agriculture"],
      keywords: ["precision agriculture", "agriculture"],
    },
    id: "precision-agriculture/seed-spacing-observed-target-gap",
    title: "Seed Spacing Observed Target Gap",
    description:
      "Subtract explicitly supplied target seed spacing from observed spacing on compatible units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetSpacing: { type: "number" },
        observedSpacing: { type: "number" },
      },
      required: ["targetSpacing", "observedSpacing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "targetSpacing",
          label: "Target Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedSpacing",
          label: "Observed Spacing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seedSpacingObservedTargetGapTool.execute;
export default seedSpacingObservedTargetGapTool;
