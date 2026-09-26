import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly string[];
  readonly second: readonly string[];
  readonly missingToken: string;
};
export type Output = {
  readonly compared: number;
  readonly agreements: number;
  readonly proportion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    second: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingToken: { type: "string", maxLength: 8192 },
  },
  required: ["first", "second", "missingToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compared: { type: "integer" },
    agreements: { type: "integer" },
    proportion: { type: "number" },
  },
  required: ["compared", "agreements", "proportion"],
} as const;
/** Pairwise exact agreement after explicit missing-token exclusion; no chance correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, missingToken } = request;
  const compute = (): Output => {
    H.domain(
      first.length === second.length &&
        first.some((v, i) => v !== missingToken && second[i] !== missingToken),
    );
    return {
      compared: first.filter(
        (v, i) => v !== missingToken && second[i] !== missingToken,
      ).length,
      agreements: first.filter(
        (v, i) =>
          v !== missingToken && second[i] !== missingToken && v === second[i],
      ).length,
      proportion:
        first.filter(
          (v, i) =>
            v !== missingToken && second[i] !== missingToken && v === second[i],
        ).length /
        first.filter((v, i) => v !== missingToken && second[i] !== missingToken)
          .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    first: ["on", "off", "?"],
    second: ["on", "on", "off"],
    missingToken: "?",
  },
  output: { compared: 2, agreements: 1, proportion: 0.5 },
} satisfies ToolExample<Input, Output>;
export const classroomObservationCoderAgreementPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "educational-psychology/classroom-observation-coder-agreement-pair",
      title: "Classroom Observation Coder Agreement Pair Tool",
      description:
        "Pairwise exact agreement after explicit missing-token exclusion; no chance correction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          second: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          missingToken: { type: "string", maxLength: 8192 },
        },
        required: ["first", "second", "missingToken"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          compared: { type: "integer" },
          agreements: { type: "integer" },
          proportion: { type: "number" },
        },
        required: ["compared", "agreements", "proportion"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "missingToken",
            label: "Missing Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "compared", label: "Compared", valueType: { type: "integer" } },
          {
            id: "agreements",
            label: "Agreements",
            valueType: { type: "integer" },
          },
          {
            id: "proportion",
            label: "Proportion",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = classroomObservationCoderAgreementPairTool.execute;
export default classroomObservationCoderAgreementPairTool;
