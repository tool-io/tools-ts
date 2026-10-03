import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly findingId: string;
  readonly priorId: string;
  readonly citedPriorId: string;
  readonly currentCategory: string;
  readonly priorCategory: string;
};
export type Output = {
  readonly linked: boolean;
  readonly sameCategory: boolean;
  readonly repeated: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    findingId: { type: "string", maxLength: 8192 },
    priorId: { type: "string", maxLength: 8192 },
    citedPriorId: { type: "string", maxLength: 8192 },
    currentCategory: { type: "string", maxLength: 8192 },
    priorCategory: { type: "string", maxLength: 8192 },
  },
  required: [
    "findingId",
    "priorId",
    "citedPriorId",
    "currentCategory",
    "priorCategory",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linked: { type: "boolean" },
    sameCategory: { type: "boolean" },
    repeated: { type: "boolean" },
  },
  required: ["linked", "sameCategory", "repeated"],
} as const;
/** Check explicit finding recurrence links and category identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { findingId, priorId, citedPriorId, currentCategory, priorCategory } =
    request;
  const compute = (): Output => {
    const linked =
      priorId.length > 0 && citedPriorId === priorId && findingId !== priorId;
    return {
      linked,
      sameCategory: currentCategory === priorCategory,
      repeated: linked && currentCategory === priorCategory,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    findingId: "F2",
    priorId: "F1",
    citedPriorId: "F1",
    currentCategory: "A",
    priorCategory: "A",
  },
  output: { linked: true, sameCategory: true, repeated: true },
} satisfies ToolExample<Input, Output>;
export const auditFindingRepeatSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/audit-finding-repeat-source-pair",
    title: "Audit Finding Repeat Source Pair Tool",
    description:
      "Check explicit finding recurrence links and category identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        findingId: { type: "string", maxLength: 8192 },
        priorId: { type: "string", maxLength: 8192 },
        citedPriorId: { type: "string", maxLength: 8192 },
        currentCategory: { type: "string", maxLength: 8192 },
        priorCategory: { type: "string", maxLength: 8192 },
      },
      required: [
        "findingId",
        "priorId",
        "citedPriorId",
        "currentCategory",
        "priorCategory",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linked: { type: "boolean" },
        sameCategory: { type: "boolean" },
        repeated: { type: "boolean" },
      },
      required: ["linked", "sameCategory", "repeated"],
    },
    ports: {
      inputs: [
        {
          id: "findingId",
          label: "Finding Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "priorId",
          label: "Prior Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "citedPriorId",
          label: "Cited Prior Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentCategory",
          label: "Current Category",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "priorCategory",
          label: "Prior Category",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "linked", label: "Linked", valueType: { type: "boolean" } },
        {
          id: "sameCategory",
          label: "Same Category",
          valueType: { type: "boolean" },
        },
        { id: "repeated", label: "Repeated", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = auditFindingRepeatSourcePairTool.execute;
export default auditFindingRepeatSourcePairTool;
