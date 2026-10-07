import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceQuotient: number;
  readonly measuredQuotient: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceQuotient: { type: "number" },
    measuredQuotient: { type: "number" },
  },
  required: ["referenceQuotient", "measuredQuotient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied reaction quotient minus explicit equilibrium reference on the same dimensionless activity basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceQuotient, measuredQuotient } = request;
  const compute = (): Output => {
    return { signedGap: measuredQuotient - referenceQuotient };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceQuotient: 12, measuredQuotient: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const reactionEquilibriumReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/reaction-equilibrium-reference-gap",
    title: "Reaction Equilibrium Reference Gap",
    description:
      "Calculate supplied reaction quotient minus explicit equilibrium reference on the same dimensionless activity basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceQuotient: { type: "number" },
        measuredQuotient: { type: "number" },
      },
      required: ["referenceQuotient", "measuredQuotient"],
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
          id: "referenceQuotient",
          label: "Reference Quotient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredQuotient",
          label: "Measured Quotient",
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
export const run = reactionEquilibriumReferenceGapTool.execute;
export default reactionEquilibriumReferenceGapTool;
