import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly instrumentId: string;
  readonly edition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    instrumentId: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "instrumentId", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit research instrument identifier by edition without scoring or validating an instrument. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, instrumentId, edition } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(instrumentId.length > 0, "instrumentId");
    H.domain(edition.length > 0, "edition");
    return { token: JSON.stringify([studyId, instrumentId, edition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyId: "ST17", instrumentId: "INST2", edition: "2026" },
  output: { token: '["ST17","INST2","2026"]' },
} satisfies ToolExample<Input, Output>;
export const researchInstrumentEditionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-research",
        "clinical research",
        "research and quality management",
      ],
      keywords: ["clinical research", "research and quality management"],
    },
    id: "clinical-research/research-instrument-edition-token",
    title: "Research Instrument Edition Token",
    description:
      "Qualify an explicit research instrument identifier by edition without scoring or validating an instrument.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
        instrumentId: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyId", "instrumentId", "edition"],
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
          id: "studyId",
          label: "Study Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "instrumentId",
          label: "Instrument Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = researchInstrumentEditionTokenTool.execute;
export default researchInstrumentEditionTokenTool;
