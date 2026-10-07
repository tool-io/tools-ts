import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tagMassDaltons: number;
  readonly untaggedProteinMassDaltons: number;
};
export type Output = {
  readonly taggedMassDaltons: number;
  readonly tagMassFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tagMassDaltons: { type: "number", minimum: 0 },
    untaggedProteinMassDaltons: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["tagMassDaltons", "untaggedProteinMassDaltons"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taggedMassDaltons: { type: "number" },
    tagMassFraction: { type: "number" },
  },
  required: ["taggedMassDaltons", "tagMassFraction"],
} as const;
/** Combine explicitly supplied tag and untagged-protein masses under an additive mass convention, without inferring sequence or cleavage losses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tagMassDaltons, untaggedProteinMassDaltons } = request;
  const compute = (): Output => {
    H.domain(tagMassDaltons >= 0, "tagMassDaltons");
    (H.domain(untaggedProteinMassDaltons > 0, "untaggedProteinMassDaltons"),
      untaggedProteinMassDaltons);
    return {
      taggedMassDaltons: tagMassDaltons + untaggedProteinMassDaltons,
      tagMassFraction:
        tagMassDaltons / (tagMassDaltons + untaggedProteinMassDaltons),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tagMassDaltons: 1000, untaggedProteinMassDaltons: 19000 },
  output: { taggedMassDaltons: 20000, tagMassFraction: 0.05 },
} satisfies ToolExample<Input, Output>;
export const proteinTagMassFractionTool = H.defineSchemaCalculation<
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
    id: "biochemistry/protein-tag-mass-fraction",
    title: "Protein Tag Mass Fraction",
    description:
      "Combine explicitly supplied tag and untagged-protein masses under an additive mass convention, without inferring sequence or cleavage losses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tagMassDaltons: { type: "number", minimum: 0 },
        untaggedProteinMassDaltons: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["tagMassDaltons", "untaggedProteinMassDaltons"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taggedMassDaltons: { type: "number" },
        tagMassFraction: { type: "number" },
      },
      required: ["taggedMassDaltons", "tagMassFraction"],
    },
    ports: {
      inputs: [
        {
          id: "tagMassDaltons",
          label: "Tag Mass Daltons",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "untaggedProteinMassDaltons",
          label: "Untagged Protein Mass Daltons",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "taggedMassDaltons",
          label: "Tagged Mass Daltons",
          valueType: { type: "number" },
        },
        {
          id: "tagMassFraction",
          label: "Tag Mass Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = proteinTagMassFractionTool.execute;
export default proteinTagMassFractionTool;
