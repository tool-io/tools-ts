import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assessorId: string;
  readonly sourceAssessorId: string;
  readonly blinded: boolean;
  readonly sourceBlinded: boolean;
  readonly instrument: string;
  readonly sourceInstrument: string;
};
export type Output = {
  readonly assessorMatches: boolean;
  readonly blindingMatches: boolean;
  readonly instrumentMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessorId: { type: "string", maxLength: 8192 },
    sourceAssessorId: { type: "string", maxLength: 8192 },
    blinded: { type: "boolean" },
    sourceBlinded: { type: "boolean" },
    instrument: { type: "string", maxLength: 8192 },
    sourceInstrument: { type: "string", maxLength: 8192 },
  },
  required: [
    "assessorId",
    "sourceAssessorId",
    "blinded",
    "sourceBlinded",
    "instrument",
    "sourceInstrument",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessorMatches: { type: "boolean" },
    blindingMatches: { type: "boolean" },
    instrumentMatches: { type: "boolean" },
  },
  required: ["assessorMatches", "blindingMatches", "instrumentMatches"],
} as const;
/** Compare explicit assessor, blinding and instrument metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    assessorId,
    sourceAssessorId,
    blinded,
    sourceBlinded,
    instrument,
    sourceInstrument,
  } = request;
  const compute = (): Output => {
    return {
      assessorMatches: assessorId === sourceAssessorId,
      blindingMatches: blinded === sourceBlinded,
      instrumentMatches: instrument === sourceInstrument,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assessorId: "A",
    sourceAssessorId: "A",
    blinded: true,
    sourceBlinded: true,
    instrument: "v1",
    sourceInstrument: "v1",
  },
  output: {
    assessorMatches: true,
    blindingMatches: true,
    instrumentMatches: true,
  },
} satisfies ToolExample<Input, Output>;
export const chiropracticResearchAssessorSourcePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chiropractic/chiropractic-research-assessor-source-pair",
      title: "Chiropractic Research Assessor Source Pair Tool",
      description:
        "Compare explicit assessor, blinding and instrument metadata.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assessorId: { type: "string", maxLength: 8192 },
          sourceAssessorId: { type: "string", maxLength: 8192 },
          blinded: { type: "boolean" },
          sourceBlinded: { type: "boolean" },
          instrument: { type: "string", maxLength: 8192 },
          sourceInstrument: { type: "string", maxLength: 8192 },
        },
        required: [
          "assessorId",
          "sourceAssessorId",
          "blinded",
          "sourceBlinded",
          "instrument",
          "sourceInstrument",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assessorMatches: { type: "boolean" },
          blindingMatches: { type: "boolean" },
          instrumentMatches: { type: "boolean" },
        },
        required: ["assessorMatches", "blindingMatches", "instrumentMatches"],
      },
      ports: {
        inputs: [
          {
            id: "assessorId",
            label: "Assessor Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceAssessorId",
            label: "Source Assessor Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "blinded",
            label: "Blinded",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "sourceBlinded",
            label: "Source Blinded",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "instrument",
            label: "Instrument",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceInstrument",
            label: "Source Instrument",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "assessorMatches",
            label: "Assessor Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "blindingMatches",
            label: "Blinding Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "instrumentMatches",
            label: "Instrument Matches",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = chiropracticResearchAssessorSourcePairTool.execute;
export default chiropracticResearchAssessorSourcePairTool;
