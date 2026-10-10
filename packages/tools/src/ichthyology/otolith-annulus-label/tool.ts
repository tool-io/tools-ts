import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly otolithSide: string;
  readonly annulusNumber: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    otolithSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "unspecified"],
    },
    annulusNumber: { type: "integer", minimum: 1 },
  },
  required: ["specimenId", "otolithSide", "annulusNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly numbered otolith annulus without inferring fish age or annual periodicity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, otolithSide, annulusNumber } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(
      ["left", "right", "unspecified"].includes(otolithSide),
      "otolithSide",
    );
    (H.domain(
      Number.isSafeInteger(annulusNumber) &&
        annulusNumber >= 1 &&
        annulusNumber <= Number.MAX_SAFE_INTEGER,
      "annulusNumber",
    ),
      annulusNumber);
    return {
      label:
        specimenId + "; " + otolithSide + " otolith annulus " + annulusNumber,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "F17", otolithSide: "left", annulusNumber: 3 },
  output: { label: "F17; left otolith annulus 3" },
} satisfies ToolExample<Input, Output>;
export const otolithAnnulusLabelTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["ichthyology", "biology"],
        keywords: ["ichthyology", "biology"],
      },
      id: "ichthyology/otolith-annulus-label",
      title: "Otolith Annulus Label",
      description:
        "Label an explicitly numbered otolith annulus without inferring fish age or annual periodicity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          specimenId: { type: "string", maxLength: 8192, minLength: 1 },
          otolithSide: {
            type: "string",
            maxLength: 8192,
            enum: ["left", "right", "unspecified"],
          },
          annulusNumber: { type: "integer", minimum: 1 },
        },
        required: ["specimenId", "otolithSide", "annulusNumber"],
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
            id: "specimenId",
            label: "Specimen Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "otolithSide",
            label: "Otolith Side",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "annulusNumber",
            label: "Annulus Number",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = otolithAnnulusLabelTool.execute;
export default otolithAnnulusLabelTool;
