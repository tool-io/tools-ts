import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sequenceId: string;
  readonly residue: string;
  readonly oneBasedPosition: number;
};
export type Output = {
  readonly label: string;
  readonly zeroBasedIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequenceId: { type: "string", maxLength: 8192, minLength: 1 },
    residue: { type: "string", maxLength: 8192 },
    oneBasedPosition: { type: "integer", minimum: 1 },
  },
  required: ["sequenceId", "residue", "oneBasedPosition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    zeroBasedIndex: { type: "integer" },
  },
  required: ["label", "zeroBasedIndex"],
} as const;
/** Label an explicitly supplied protein residue symbol and one-based position without checking a sequence or inferring a substitution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sequenceId, residue, oneBasedPosition } = request;
  const compute = (): Output => {
    H.domain(sequenceId.length > 0, "sequenceId");
    H.domain(/^[A-Z*](?![\s\S])/.test(residue), "residue");
    (H.domain(
      Number.isSafeInteger(oneBasedPosition) &&
        oneBasedPosition >= 1 &&
        oneBasedPosition <= Number.MAX_SAFE_INTEGER,
      "oneBasedPosition",
    ),
      oneBasedPosition);
    return {
      label: sequenceId + ":" + residue + oneBasedPosition,
      zeroBasedIndex: oneBasedPosition - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sequenceId: "P17", residue: "K", oneBasedPosition: 42 },
  output: { label: "P17:K42", zeroBasedIndex: 41 },
} satisfies ToolExample<Input, Output>;
export const proteinResiduePositionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioinformatics", "biology"],
      keywords: ["bioinformatics", "biology"],
    },
    id: "bioinformatics/protein-residue-position-label",
    title: "Protein Residue Position Label",
    description:
      "Label an explicitly supplied protein residue symbol and one-based position without checking a sequence or inferring a substitution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sequenceId: { type: "string", maxLength: 8192, minLength: 1 },
        residue: { type: "string", maxLength: 8192 },
        oneBasedPosition: { type: "integer", minimum: 1 },
      },
      required: ["sequenceId", "residue", "oneBasedPosition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        zeroBasedIndex: { type: "integer" },
      },
      required: ["label", "zeroBasedIndex"],
    },
    ports: {
      inputs: [
        {
          id: "sequenceId",
          label: "Sequence Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "residue",
          label: "Residue",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "oneBasedPosition",
          label: "One Based Position",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "zeroBasedIndex",
          label: "Zero Based Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = proteinResiduePositionLabelTool.execute;
export default proteinResiduePositionLabelTool;
