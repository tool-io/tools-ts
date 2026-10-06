import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coverContacts: number;
  readonly sampledPoints: number;
};
export type Output = { readonly contactFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coverContacts: { type: "integer", minimum: 0 },
    sampledPoints: { type: "integer", minimum: 1 },
  },
  required: ["coverContacts", "sampledPoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contactFraction: { type: "number" } },
  required: ["contactFraction"],
} as const;
/** Calculate a point-contact ground-cover fraction with at most one coded cover contact per sampled point. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coverContacts, sampledPoints } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sampledPoints) &&
        sampledPoints >= 1 &&
        sampledPoints <= Number.MAX_SAFE_INTEGER,
      "sampledPoints",
    ),
      sampledPoints);
    (H.domain(
      Number.isSafeInteger(coverContacts) &&
        coverContacts >= 0 &&
        coverContacts <= sampledPoints,
      "coverContacts",
    ),
      coverContacts);
    return { contactFraction: coverContacts / sampledPoints };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coverContacts: 38, sampledPoints: 50 },
  output: { contactFraction: 0.76 },
} satisfies ToolExample<Input, Output>;
export const groundCoverQuadratContactFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/ground-cover-quadrat-contact-fraction",
    title: "Ground Cover Quadrat Contact Fraction",
    description:
      "Calculate a point-contact ground-cover fraction with at most one coded cover contact per sampled point.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coverContacts: { type: "integer", minimum: 0 },
        sampledPoints: { type: "integer", minimum: 1 },
      },
      required: ["coverContacts", "sampledPoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contactFraction: { type: "number" } },
      required: ["contactFraction"],
    },
    ports: {
      inputs: [
        {
          id: "coverContacts",
          label: "Cover Contacts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampledPoints",
          label: "Sampled Points",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "contactFraction",
          label: "Contact Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = groundCoverQuadratContactFractionTool.execute;
export default groundCoverQuadratContactFractionTool;
