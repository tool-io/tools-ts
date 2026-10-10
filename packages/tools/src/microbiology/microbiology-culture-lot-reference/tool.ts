import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cultureId: string;
  readonly mediumLot: string;
  readonly incubationRecord: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cultureId: { type: "string", maxLength: 8192, minLength: 1 },
    mediumLot: { type: "string", maxLength: 8192, minLength: 1 },
    incubationRecord: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["cultureId", "mediumLot", "incubationRecord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate supplied culture, medium-lot, and incubation-record identifiers without recommending culture conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cultureId, mediumLot, incubationRecord } = request;
  const compute = (): Output => {
    H.domain(cultureId.length > 0, "cultureId");
    H.domain(mediumLot.length > 0, "mediumLot");
    H.domain(incubationRecord.length > 0, "incubationRecord");
    return { token: JSON.stringify([cultureId, mediumLot, incubationRecord]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cultureId: "C17", mediumLot: "LOT-A", incubationRecord: "INC3" },
  output: { token: '["C17","LOT-A","INC3"]' },
} satisfies ToolExample<Input, Output>;
export const microbiologyCultureLotReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["microbiology", "biology"],
      keywords: ["microbiology", "biology"],
    },
    id: "microbiology/microbiology-culture-lot-reference",
    title: "Microbiology Culture Lot Reference",
    description:
      "Associate supplied culture, medium-lot, and incubation-record identifiers without recommending culture conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cultureId: { type: "string", maxLength: 8192, minLength: 1 },
        mediumLot: { type: "string", maxLength: 8192, minLength: 1 },
        incubationRecord: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["cultureId", "mediumLot", "incubationRecord"],
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
          id: "cultureId",
          label: "Culture Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mediumLot",
          label: "Medium Lot",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "incubationRecord",
          label: "Incubation Record",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = microbiologyCultureLotReferenceTool.execute;
export default microbiologyCultureLotReferenceTool;
