import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occurrenceId: string;
  readonly suppliedBasis: string;
  readonly vocabularySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedBasis: { type: "string", maxLength: 8192, minLength: 1 },
    vocabularySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["occurrenceId", "suppliedBasis", "vocabularySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit occurrence basis-of-record term and vocabulary source without inferring evidence quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occurrenceId, suppliedBasis, vocabularySource } = request;
  const compute = (): Output => {
    H.domain(occurrenceId.length > 0, "occurrenceId");
    H.domain(suppliedBasis.length > 0, "suppliedBasis");
    H.domain(vocabularySource.length > 0, "vocabularySource");
    return {
      token: JSON.stringify([occurrenceId, suppliedBasis, vocabularySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    occurrenceId: "O17",
    suppliedBasis: "HumanObservation",
    vocabularySource: "source V4",
  },
  output: { token: '["O17","HumanObservation","source V4"]' },
} satisfies ToolExample<Input, Output>;
export const speciesOccurrenceBasisOfRecordTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biodiversity", "biology"],
        keywords: ["biodiversity", "biology"],
      },
      id: "biodiversity/species-occurrence-basis-of-record-token",
      title: "Species Occurrence Basis Of Record Token",
      description:
        "Preserve an explicit occurrence basis-of-record term and vocabulary source without inferring evidence quality.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedBasis: { type: "string", maxLength: 8192, minLength: 1 },
          vocabularySource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["occurrenceId", "suppliedBasis", "vocabularySource"],
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
            id: "occurrenceId",
            label: "Occurrence Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedBasis",
            label: "Supplied Basis",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "vocabularySource",
            label: "Vocabulary Source",
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
export const run = speciesOccurrenceBasisOfRecordTokenTool.execute;
export default speciesOccurrenceBasisOfRecordTokenTool;
