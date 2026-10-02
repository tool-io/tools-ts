import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceSystem: string;
  readonly visitId: string;
  readonly expectedSystem: string;
  readonly expectedVisit: string;
};
export type Output = {
  readonly sourceMatches: boolean;
  readonly visitMatches: boolean;
  readonly compositeKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceSystem: { type: "string", maxLength: 8192 },
    visitId: { type: "string", maxLength: 8192 },
    expectedSystem: { type: "string", maxLength: 8192 },
    expectedVisit: { type: "string", maxLength: 8192 },
  },
  required: ["sourceSystem", "visitId", "expectedSystem", "expectedVisit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceMatches: { type: "boolean" },
    visitMatches: { type: "boolean" },
    compositeKey: { type: "string", maxLength: 8192 },
  },
  required: ["sourceMatches", "visitMatches", "compositeKey"],
} as const;
/** Cross-reference source system and exact visit identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceSystem, visitId, expectedSystem, expectedVisit } = request;
  const compute = (): Output => {
    return {
      sourceMatches: sourceSystem === expectedSystem,
      visitMatches: visitId === expectedVisit,
      compositeKey: JSON.stringify([sourceSystem, visitId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceSystem: "A",
    visitId: "001",
    expectedSystem: "A",
    expectedVisit: "001",
  },
  output: {
    sourceMatches: true,
    visitMatches: true,
    compositeKey: '["A","001"]',
  },
} satisfies ToolExample<Input, Output>;
export const periodontalRecordVisitSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/periodontal-record-visit-source-pair",
    title: "Periodontal Record Visit Source Pair Tool",
    description: "Cross-reference source system and exact visit identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceSystem: { type: "string", maxLength: 8192 },
        visitId: { type: "string", maxLength: 8192 },
        expectedSystem: { type: "string", maxLength: 8192 },
        expectedVisit: { type: "string", maxLength: 8192 },
      },
      required: ["sourceSystem", "visitId", "expectedSystem", "expectedVisit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceMatches: { type: "boolean" },
        visitMatches: { type: "boolean" },
        compositeKey: { type: "string", maxLength: 8192 },
      },
      required: ["sourceMatches", "visitMatches", "compositeKey"],
    },
    ports: {
      inputs: [
        {
          id: "sourceSystem",
          label: "Source System",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "visitId",
          label: "Visit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedSystem",
          label: "Expected System",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedVisit",
          label: "Expected Visit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sourceMatches",
          label: "Source Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "visitMatches",
          label: "Visit Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "compositeKey",
          label: "Composite Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = periodontalRecordVisitSourcePairTool.execute;
export default periodontalRecordVisitSourcePairTool;
