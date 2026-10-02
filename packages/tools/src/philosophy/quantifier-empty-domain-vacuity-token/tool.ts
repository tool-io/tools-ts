import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly truths: readonly boolean[];
  readonly quantifier: string;
};
export type Output = { readonly truth: boolean; readonly emptyDomain: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    truths: { type: "array", maxItems: 256, items: { type: "boolean" } },
    quantifier: { type: "string", maxLength: 8192, enum: ["all", "exists"] },
  },
  required: ["truths", "quantifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { truth: { type: "boolean" }, emptyDomain: { type: "boolean" } },
  required: ["truth", "emptyDomain"],
} as const;
/** Finite classical quantifier evaluation, including universal vacuity and false empty existential. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { truths, quantifier } = request;
  const compute = (): Output => {
    H.domain(["all", "exists"].includes(quantifier));
    return {
      truth:
        quantifier === "all" ? truths.every(Boolean) : truths.some(Boolean),
      emptyDomain: truths.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { truths: [], quantifier: "all" },
  output: { truth: true, emptyDomain: true },
} satisfies ToolExample<Input, Output>;
export const quantifierEmptyDomainVacuityTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/quantifier-empty-domain-vacuity-token",
    title: "Quantifier Empty Domain Vacuity Token Tool",
    description:
      "Finite classical quantifier evaluation, including universal vacuity and false empty existential.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        truths: { type: "array", maxItems: 256, items: { type: "boolean" } },
        quantifier: {
          type: "string",
          maxLength: 8192,
          enum: ["all", "exists"],
        },
      },
      required: ["truths", "quantifier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        truth: { type: "boolean" },
        emptyDomain: { type: "boolean" },
      },
      required: ["truth", "emptyDomain"],
    },
    ports: {
      inputs: [
        {
          id: "truths",
          label: "Truths",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "quantifier",
          label: "Quantifier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "truth", label: "Truth", valueType: { type: "boolean" } },
        {
          id: "emptyDomain",
          label: "Empty Domain",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = quantifierEmptyDomainVacuityTokenTool.execute;
export default quantifierEmptyDomainVacuityTokenTool;
