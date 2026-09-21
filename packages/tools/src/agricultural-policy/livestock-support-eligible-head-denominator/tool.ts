import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reported: number;
  readonly ineligible: number;
  readonly duplicate: number;
  readonly duplicateAlreadyIneligible: number;
};
export type Output = { readonly eligible: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reported: { type: "integer", minimum: 0 },
    ineligible: { type: "integer", minimum: 0 },
    duplicate: { type: "integer", minimum: 0 },
    duplicateAlreadyIneligible: { type: "integer", minimum: 0 },
  },
  required: [
    "reported",
    "ineligible",
    "duplicate",
    "duplicateAlreadyIneligible",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligible: { type: "integer" } },
  required: ["eligible"],
} as const;
/** Calculate livestock support eligible head denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reported, ineligible, duplicate, duplicateAlreadyIneligible } =
    request;
  const compute = (): Output => {
    H.integer(reported, 0);
    H.integer(ineligible, 0, reported);
    H.integer(duplicate, 0, reported);
    H.integer(duplicateAlreadyIneligible, 0, Math.min(ineligible, duplicate));
    H.domain(ineligible + duplicate - duplicateAlreadyIneligible <= reported);
    return {
      eligible: reported - ineligible - duplicate + duplicateAlreadyIneligible,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reported: 100,
    ineligible: 10,
    duplicate: 5,
    duplicateAlreadyIneligible: 2,
  },
  output: { eligible: 87 },
} satisfies ToolExample<Input, Output>;
export const livestockSupportEligibleHeadDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-policy/livestock-support-eligible-head-denominator",
      title: "Livestock Support Eligible Head Denominator Tool",
      description:
        "Calculate livestock support eligible head denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reported: { type: "integer", minimum: 0 },
          ineligible: { type: "integer", minimum: 0 },
          duplicate: { type: "integer", minimum: 0 },
          duplicateAlreadyIneligible: { type: "integer", minimum: 0 },
        },
        required: [
          "reported",
          "ineligible",
          "duplicate",
          "duplicateAlreadyIneligible",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { eligible: { type: "integer" } },
        required: ["eligible"],
      },
      ports: {
        inputs: [
          {
            id: "reported",
            label: "Reported",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "ineligible",
            label: "Ineligible",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "duplicate",
            label: "Duplicate",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "duplicateAlreadyIneligible",
            label: "Duplicate Already Ineligible",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = livestockSupportEligibleHeadDenominatorTool.execute;
export default livestockSupportEligibleHeadDenominatorTool;
