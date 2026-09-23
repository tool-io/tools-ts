import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly combinationId: string;
  readonly citedBasionym: string;
  readonly expectedBasionym: string;
  readonly combinationEpithet: string;
  readonly basionymEpithet: string;
};
export type Output = {
  readonly linked: boolean;
  readonly epithetMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    combinationId: { type: "string", maxLength: 8192 },
    citedBasionym: { type: "string", maxLength: 8192 },
    expectedBasionym: { type: "string", maxLength: 8192 },
    combinationEpithet: { type: "string", maxLength: 8192 },
    basionymEpithet: { type: "string", maxLength: 8192 },
  },
  required: [
    "combinationId",
    "citedBasionym",
    "expectedBasionym",
    "combinationEpithet",
    "basionymEpithet",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linked: { type: "boolean" },
    epithetMatches: { type: "boolean" },
  },
  required: ["linked", "epithetMatches"],
} as const;
/** Compare supplied combination/basionym references without deciding a valid combination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    combinationId,
    citedBasionym,
    expectedBasionym,
    combinationEpithet,
    basionymEpithet,
  } = request;
  const compute = (): Output => {
    H.domain(combinationId.length > 0, "combinationId");
    return {
      linked: citedBasionym === expectedBasionym,
      epithetMatches: combinationEpithet === basionymEpithet,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    combinationId: "C1",
    citedBasionym: "B1",
    expectedBasionym: "B1",
    combinationEpithet: "bus",
    basionymEpithet: "bus",
  },
  output: { linked: true, epithetMatches: true },
} satisfies ToolExample<Input, Output>;
export const taxonomicCombinationBasionymLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxonomic-combination-basionym-link",
    title: "Taxonomic Combination Basionym Link Tool",
    description:
      "Compare supplied combination/basionym references without deciding a valid combination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        combinationId: { type: "string", maxLength: 8192 },
        citedBasionym: { type: "string", maxLength: 8192 },
        expectedBasionym: { type: "string", maxLength: 8192 },
        combinationEpithet: { type: "string", maxLength: 8192 },
        basionymEpithet: { type: "string", maxLength: 8192 },
      },
      required: [
        "combinationId",
        "citedBasionym",
        "expectedBasionym",
        "combinationEpithet",
        "basionymEpithet",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linked: { type: "boolean" },
        epithetMatches: { type: "boolean" },
      },
      required: ["linked", "epithetMatches"],
    },
    ports: {
      inputs: [
        {
          id: "combinationId",
          label: "Combination Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "citedBasionym",
          label: "Cited Basionym",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedBasionym",
          label: "Expected Basionym",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "combinationEpithet",
          label: "Combination Epithet",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "basionymEpithet",
          label: "Basionym Epithet",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "linked", label: "Linked", valueType: { type: "boolean" } },
        {
          id: "epithetMatches",
          label: "Epithet Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonomicCombinationBasionymLinkTool.execute;
export default taxonomicCombinationBasionymLinkTool;
