import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly serviceCode: string;
  readonly included: readonly string[];
  readonly excluded: readonly string[];
  readonly exclusionWins: boolean;
};
export type Output = {
  readonly included: boolean;
  readonly excluded: boolean;
  readonly conflict: boolean;
  readonly covered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serviceCode: { type: "string", maxLength: 8192 },
    included: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    excluded: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    exclusionWins: { type: "boolean" },
  },
  required: ["serviceCode", "included", "excluded", "exclusionWins"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    included: { type: "boolean" },
    excluded: { type: "boolean" },
    conflict: { type: "boolean" },
    covered: { type: "boolean" },
  },
  required: ["included", "excluded", "conflict", "covered"],
} as const;
/** Resolve explicit inclusion/exclusion tokens under a supplied conflict policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { serviceCode, included, excluded, exclusionWins } = request;
  const compute = (): Output => {
    const inc = included.includes(serviceCode),
      exc = excluded.includes(serviceCode);
    return {
      included: inc,
      excluded: exc,
      conflict: inc && exc,
      covered: exclusionWins ? inc && !exc : inc,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    serviceCode: "A",
    included: ["A", "B"],
    excluded: ["A"],
    exclusionWins: true,
  },
  output: { included: true, excluded: true, conflict: true, covered: false },
} satisfies ToolExample<Input, Output>;
export const benefitPackageExclusionTokenPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/benefit-package-exclusion-token-pair",
    title: "Benefit Package Exclusion Token Pair Tool",
    description:
      "Resolve explicit inclusion/exclusion tokens under a supplied conflict policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serviceCode: { type: "string", maxLength: 8192 },
        included: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        excluded: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        exclusionWins: { type: "boolean" },
      },
      required: ["serviceCode", "included", "excluded", "exclusionWins"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        included: { type: "boolean" },
        excluded: { type: "boolean" },
        conflict: { type: "boolean" },
        covered: { type: "boolean" },
      },
      required: ["included", "excluded", "conflict", "covered"],
    },
    ports: {
      inputs: [
        {
          id: "serviceCode",
          label: "Service Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "exclusionWins",
          label: "Exclusion Wins",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "included", label: "Included", valueType: { type: "boolean" } },
        { id: "excluded", label: "Excluded", valueType: { type: "boolean" } },
        { id: "conflict", label: "Conflict", valueType: { type: "boolean" } },
        { id: "covered", label: "Covered", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = benefitPackageExclusionTokenPairTool.execute;
export default benefitPackageExclusionTokenPairTool;
