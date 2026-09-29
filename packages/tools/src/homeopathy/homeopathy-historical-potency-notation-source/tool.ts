import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly sourceId: string;
  readonly edition: string;
};
export type Output = {
  readonly stage: number;
  readonly notation: string;
  readonly sourceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    sourceId: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: ["token", "sourceId", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stage: { type: "integer" },
    notation: { type: "string", maxLength: 8192 },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["stage", "notation", "sourceKey"],
} as const;
/** Parse a bounded historical C/X notation subset and preserve source attribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, sourceId, edition } = request;
  const compute = (): Output => {
    const match = /^([1-9]\d*)([CX])(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const stage = Number(match[1]);
    H.integer(stage, 1);
    H.domain(sourceId.length > 0 && edition.length > 0);
    return {
      stage,
      notation: match[2],
      sourceKey: JSON.stringify([sourceId, edition, token]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "30C", sourceId: "doc-A", edition: "v1" },
  output: { stage: 30, notation: "C", sourceKey: '["doc-A","v1","30C"]' },
} satisfies ToolExample<Input, Output>;
export const homeopathyHistoricalPotencyNotationSourceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "homeopathy/homeopathy-historical-potency-notation-source",
      title: "Homeopathy Historical Potency Notation Source Tool",
      description:
        "Parse a bounded historical C/X notation subset and preserve source attribution.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          token: { type: "string", maxLength: 8192 },
          sourceId: { type: "string", maxLength: 8192 },
          edition: { type: "string", maxLength: 8192 },
        },
        required: ["token", "sourceId", "edition"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stage: { type: "integer" },
          notation: { type: "string", maxLength: 8192 },
          sourceKey: { type: "string", maxLength: 8192 },
        },
        required: ["stage", "notation", "sourceKey"],
      },
      ports: {
        inputs: [
          {
            id: "token",
            label: "Token",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceId",
            label: "Source Id",
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
        outputs: [
          { id: "stage", label: "Stage", valueType: { type: "integer" } },
          { id: "notation", label: "Notation", valueType: { type: "string" } },
          {
            id: "sourceKey",
            label: "Source Key",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = homeopathyHistoricalPotencyNotationSourceTool.execute;
export default homeopathyHistoricalPotencyNotationSourceTool;
