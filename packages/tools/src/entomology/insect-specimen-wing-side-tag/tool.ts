import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenCode: string;
  readonly wingPair: string;
  readonly side: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenCode: { type: "string", maxLength: 8192, minLength: 1 },
    wingPair: {
      type: "string",
      maxLength: 8192,
      enum: ["forewing", "hindwing", "unspecified"],
    },
    side: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "unspecified"],
    },
  },
  required: ["specimenCode", "wingPair", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Attach supplied wing-pair and laterality annotations to an insect specimen record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenCode, wingPair, side } = request;
  const compute = (): Output => {
    H.domain(specimenCode.length > 0, "specimenCode");
    H.domain(
      ["forewing", "hindwing", "unspecified"].includes(wingPair),
      "wingPair",
    );
    H.domain(["left", "right", "unspecified"].includes(side), "side");
    return { tag: specimenCode + "; " + wingPair + "; " + side };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenCode: "INS17", wingPair: "forewing", side: "left" },
  output: { tag: "INS17; forewing; left" },
} satisfies ToolExample<Input, Output>;
export const insectSpecimenWingSideTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["entomology", "biology"],
      keywords: ["entomology", "biology"],
    },
    id: "entomology/insect-specimen-wing-side-tag",
    title: "Insect Specimen Wing Side Tag",
    description:
      "Attach supplied wing-pair and laterality annotations to an insect specimen record.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenCode: { type: "string", maxLength: 8192, minLength: 1 },
        wingPair: {
          type: "string",
          maxLength: 8192,
          enum: ["forewing", "hindwing", "unspecified"],
        },
        side: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "unspecified"],
        },
      },
      required: ["specimenCode", "wingPair", "side"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "specimenCode",
          label: "Specimen Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "wingPair",
          label: "Wing Pair",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = insectSpecimenWingSideTagTool.execute;
export default insectSpecimenWingSideTagTool;
