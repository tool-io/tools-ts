import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly premiseIds: readonly string[];
  readonly references: readonly string[];
};
export type Output = {
  readonly distinctReferencedPremises: number;
  readonly unresolvedReferences: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premiseIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    references: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["premiseIds", "references"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distinctReferencedPremises: { type: "integer" },
    unresolvedReferences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["distinctReferencedPremises", "unresolvedReferences"],
} as const;
/** Audit exact supplied premise references without evaluating an argument’s truth or validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { premiseIds, references } = request;
  const compute = (): Output => {
    return {
      distinctReferencedPremises: new Set(
        references.filter((x) => premiseIds.includes(x)),
      ).size,
      unresolvedReferences: references.filter((x) => !premiseIds.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { premiseIds: ["P1", "P2"], references: ["P1", "P1", "P3"] },
  output: { distinctReferencedPremises: 1, unresolvedReferences: ["P3"] },
} satisfies ToolExample<Input, Output>;
export const argumentPremiseReferenceCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/argument-premise-reference-count",
    title: "Argument Premise Reference Count Tool",
    description:
      "Audit exact supplied premise references without evaluating an argument’s truth or validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premiseIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        references: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["premiseIds", "references"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distinctReferencedPremises: { type: "integer" },
        unresolvedReferences: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["distinctReferencedPremises", "unresolvedReferences"],
    },
    ports: {
      inputs: [
        {
          id: "premiseIds",
          label: "Premise Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "references",
          label: "References",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "distinctReferencedPremises",
          label: "Distinct Referenced Premises",
          valueType: { type: "integer" },
        },
        {
          id: "unresolvedReferences",
          label: "Unresolved References",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = argumentPremiseReferenceCountTool.execute;
export default argumentPremiseReferenceCountTool;
