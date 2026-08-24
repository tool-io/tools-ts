import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnglicanaSecretaryDiscriminatorInput = {
  readonly anglicanaTraitCount: number;
  readonly secretaryTraitCount: number;
};

export type AnglicanaSecretaryDiscriminatorOutput = {
  readonly verdict: "anglicana" | "secretary" | "indeterminate";
  readonly traitMargin: number;
};

export const calculateAnglicanaSecretaryDiscriminator = (
  input: AnglicanaSecretaryDiscriminatorInput,
): AnglicanaSecretaryDiscriminatorOutput => {
  for (const key of ["anglicanaTraitCount", "secretaryTraitCount"] as const) {
    if (!(Number.isSafeInteger(input[key]) && input[key] >= 0))
      return simpleError(
        key,
        "Trait tallies must be non-negative integers.",
        "invalid_tally",
      );
  }
  const margin = Math.abs(
    input.anglicanaTraitCount - input.secretaryTraitCount,
  );
  const verdict =
    input.anglicanaTraitCount > input.secretaryTraitCount
      ? "anglicana"
      : input.secretaryTraitCount > input.anglicanaTraitCount
        ? "secretary"
        : "indeterminate";
  return { verdict, traitMargin: margin };
};

export const anglicanaSecretaryDiscriminatorExample = {
  input: { anglicanaTraitCount: 4, secretaryTraitCount: 1 },
  output: { verdict: "anglicana", traitMargin: 3 },
} satisfies ToolExample<
  AnglicanaSecretaryDiscriminatorInput,
  AnglicanaSecretaryDiscriminatorOutput
>;

export const anglicanaSecretaryDiscriminatorTool = createSimpleTool({
  id: "paleography/anglicana-secretary-discriminator",
  title: "Anglicana vs Secretary Discriminator",
  description:
    "Compare the number of observed Anglicana traits against the number of observed Secretary traits on your checklist and return the majority script with the tally margin, declaring a tie indeterminate (transparent arithmetic comparator, no contested letterform weighting).",
  inputs: [
    {
      description: "Count of checklist traits pointing to Anglicana cursive.",
      id: "anglicanaTraitCount",
      kind: "integer",
      label: "Anglicana traits",
      minimum: 0,
    },
    {
      description: "Count of checklist traits pointing to Secretary hand.",
      id: "secretaryTraitCount",
      kind: "integer",
      label: "Secretary traits",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Majority script or indeterminate on a tie.",
      id: "verdict",
      enum: ["anglicana", "secretary", "indeterminate"],
      kind: "string",
      label: "Verdict",
    },
    {
      description: "Absolute difference between the two trait tallies.",
      id: "traitMargin",
      kind: "integer",
      label: "Trait margin",
    },
  ],
  calculate: (input) =>
    calculateAnglicanaSecretaryDiscriminator({
      anglicanaTraitCount: input.anglicanaTraitCount as number,
      secretaryTraitCount: input.secretaryTraitCount as number,
    }),
});

export const runAnglicanaSecretaryDiscriminator =
  anglicanaSecretaryDiscriminatorTool.execute;
export default anglicanaSecretaryDiscriminatorTool;
