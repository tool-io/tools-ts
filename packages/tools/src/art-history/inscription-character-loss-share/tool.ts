import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retainedCharacters: number;
  readonly estimatedMissingCharacters: number;
};
export type Output = {
  readonly estimatedTotalDecimal: string;
  readonly lossShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedCharacters: { type: "integer", minimum: 0 },
    estimatedMissingCharacters: { type: "integer", minimum: 0 },
  },
  required: ["retainedCharacters", "estimatedMissingCharacters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedTotalDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    lossShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["estimatedTotalDecimal", "lossShare", "defined"],
} as const;
/** Use explicit transcription loss estimates; do not reconstruct an inscription or invent characters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retainedCharacters, estimatedMissingCharacters } = request;
  const compute = (): Output => {
    return (() => {
      H.integer(retainedCharacters, 0);
      H.integer(estimatedMissingCharacters, 0);
      const total =
        BigInt(retainedCharacters) + BigInt(estimatedMissingCharacters);
      return {
        estimatedTotalDecimal: total.toString(),
        lossShare: total > 0n ? estimatedMissingCharacters / Number(total) : 0,
        defined: total > 0n,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retainedCharacters: 80, estimatedMissingCharacters: 20 },
  output: { estimatedTotalDecimal: "100", lossShare: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const inscriptionCharacterLossShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/inscription-character-loss-share",
    title: "Inscription Character Loss Share Tool",
    description:
      "Use explicit transcription loss estimates; do not reconstruct an inscription or invent characters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedCharacters: { type: "integer", minimum: 0 },
        estimatedMissingCharacters: { type: "integer", minimum: 0 },
      },
      required: ["retainedCharacters", "estimatedMissingCharacters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimatedTotalDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        lossShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["estimatedTotalDecimal", "lossShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "retainedCharacters",
          label: "Retained Characters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "estimatedMissingCharacters",
          label: "Estimated Missing Characters",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "estimatedTotalDecimal",
          label: "Estimated Total Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "lossShare", label: "Loss Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = inscriptionCharacterLossShareTool.execute;
export default inscriptionCharacterLossShareTool;
