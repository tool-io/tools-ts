import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recipientP: number;
  readonly sourceP: number;
  readonly migrantFraction: number;
};
export type Output = { readonly nextP: number; readonly change: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recipientP: { type: "number", minimum: 0, maximum: 1 },
    sourceP: { type: "number", minimum: 0, maximum: 1 },
    migrantFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["recipientP", "sourceP", "migrantFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextP: { type: "number" }, change: { type: "number" } },
  required: ["nextP", "change"],
} as const;
/** Calculate migration source recipient allele gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recipientP, sourceP, migrantFraction } = request;
  const compute = (): Output => {
    H.probability(recipientP);
    H.probability(sourceP);
    H.probability(migrantFraction);
    return {
      nextP: (1 - migrantFraction) * recipientP + migrantFraction * sourceP,
      change: migrantFraction * (sourceP - recipientP),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recipientP: 0.2, sourceP: 0.8, migrantFraction: 0.1 },
  output: { nextP: 0.26, change: 0.06000000000000001 },
} satisfies ToolExample<Input, Output>;
export const migrationSourceRecipientAlleleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/migration-source-recipient-allele-gap",
    title: "Migration Source Recipient Allele Gap Tool",
    description:
      "Calculate migration source recipient allele gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recipientP: { type: "number", minimum: 0, maximum: 1 },
        sourceP: { type: "number", minimum: 0, maximum: 1 },
        migrantFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["recipientP", "sourceP", "migrantFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nextP: { type: "number" }, change: { type: "number" } },
      required: ["nextP", "change"],
    },
    ports: {
      inputs: [
        {
          id: "recipientP",
          label: "Recipient P",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceP",
          label: "Source P",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "migrantFraction",
          label: "Migrant Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "nextP", label: "Next P", valueType: { type: "number" } },
        { id: "change", label: "Change", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = migrationSourceRecipientAlleleGapTool.execute;
export default migrationSourceRecipientAlleleGapTool;
