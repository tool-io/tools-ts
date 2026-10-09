import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedDegreeAbbreviation: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDegreeAbbreviation: {
      type: "string",
      maxLength: 8192,
      minLength: 1,
    },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedDegreeAbbreviation", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit degree abbreviation by source without asserting equivalence or professional qualification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedDegreeAbbreviation, source } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      suppliedDegreeAbbreviation.length > 0,
      "suppliedDegreeAbbreviation",
    );
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([recordId, suppliedDegreeAbbreviation, source]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedDegreeAbbreviation: "Abbrev. A",
    source: "University record A",
  },
  output: { token: '["R17","Abbrev. A","University record A"]' },
} satisfies ToolExample<Input, Output>;
export const europeanUniversityDegreeSourceAbbreviationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["european-studies", "european studies", "humanities"],
        keywords: ["european studies", "humanities"],
      },
      id: "european-studies/european-university-degree-source-abbreviation",
      title: "European University Degree Source Abbreviation",
      description:
        "Qualify an explicit degree abbreviation by source without asserting equivalence or professional qualification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedDegreeAbbreviation: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedDegreeAbbreviation", "source"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedDegreeAbbreviation",
            label: "Supplied Degree Abbreviation",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = europeanUniversityDegreeSourceAbbreviationTool.execute;
export default europeanUniversityDegreeSourceAbbreviationTool;
