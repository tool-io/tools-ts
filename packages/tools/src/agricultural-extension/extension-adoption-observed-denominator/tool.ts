import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly adopted: number;
  readonly observed: number;
  readonly unobserved: number;
  readonly includeUnobserved: boolean;
};
export type Output = { readonly denominator: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adopted: { type: "integer", minimum: 0 },
    observed: { type: "integer", minimum: 1 },
    unobserved: { type: "integer", minimum: 0 },
    includeUnobserved: { type: "boolean" },
  },
  required: ["adopted", "observed", "unobserved", "includeUnobserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "integer" }, share: { type: "number" } },
  required: ["denominator", "share"],
} as const;
/** Audit observed adoption counts under an explicit missing-observation denominator policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { adopted, observed, unobserved, includeUnobserved } = request;
  const compute = (): Output => {
    H.integer(observed, 1);
    H.integer(adopted, 0, observed);
    H.integer(unobserved, 0);
    return {
      denominator: observed + (includeUnobserved ? unobserved : 0),
      share: adopted / (observed + (includeUnobserved ? unobserved : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    adopted: 30,
    observed: 60,
    unobserved: 40,
    includeUnobserved: false,
  },
  output: { denominator: 60, share: 0.5 },
} satisfies ToolExample<Input, Output>;
export const extensionAdoptionObservedDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/extension-adoption-observed-denominator",
      title: "Extension Adoption Observed Denominator Tool",
      description:
        "Audit observed adoption counts under an explicit missing-observation denominator policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          adopted: { type: "integer", minimum: 0 },
          observed: { type: "integer", minimum: 1 },
          unobserved: { type: "integer", minimum: 0 },
          includeUnobserved: { type: "boolean" },
        },
        required: ["adopted", "observed", "unobserved", "includeUnobserved"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          share: { type: "number" },
        },
        required: ["denominator", "share"],
      },
      ports: {
        inputs: [
          {
            id: "adopted",
            label: "Adopted",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unobserved",
            label: "Unobserved",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeUnobserved",
            label: "Include Unobserved",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          { id: "share", label: "Share", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = extensionAdoptionObservedDenominatorTool.execute;
export default extensionAdoptionObservedDenominatorTool;
