import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moduleHours: number;
  readonly creditPerHour: number;
  readonly eligibleFraction: number;
  readonly existingCredit: number;
  readonly requiredCredit: number;
};
export type Output = {
  readonly moduleCredit: number;
  readonly projectedCredit: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moduleHours: { type: "number", minimum: 0 },
    creditPerHour: { type: "number", minimum: 0 },
    eligibleFraction: { type: "number", minimum: 0, maximum: 1 },
    existingCredit: { type: "number", minimum: 0 },
    requiredCredit: { type: "number", minimum: 0 },
  },
  required: [
    "moduleHours",
    "creditPerHour",
    "eligibleFraction",
    "existingCredit",
    "requiredCredit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moduleCredit: { type: "number" },
    projectedCredit: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["moduleCredit", "projectedCredit", "remaining"],
} as const;
/** Explicit module conversion and eligibility fraction; no qualification policy is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    moduleHours,
    creditPerHour,
    eligibleFraction,
    existingCredit,
    requiredCredit,
  } = request;
  const compute = (): Output => {
    H.domain(
      moduleHours >= 0 &&
        creditPerHour >= 0 &&
        existingCredit >= 0 &&
        requiredCredit >= 0,
    );
    H.probability(eligibleFraction);
    return {
      moduleCredit: moduleHours * creditPerHour * eligibleFraction,
      projectedCredit:
        existingCredit + moduleHours * creditPerHour * eligibleFraction,
      remaining: Math.max(
        0,
        requiredCredit -
          existingCredit -
          moduleHours * creditPerHour * eligibleFraction,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    moduleHours: 10,
    creditPerHour: 1,
    eligibleFraction: 0.8,
    existingCredit: 15,
    requiredCredit: 30,
  },
  output: { moduleCredit: 8, projectedCredit: 23, remaining: 7 },
} satisfies ToolExample<Input, Output>;
export const qualificationRenewalCreditOneModuleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "adult-education/qualification-renewal-credit-one-module",
      title: "Qualification Renewal Credit One Module Tool",
      description:
        "Explicit module conversion and eligibility fraction; no qualification policy is chosen.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          moduleHours: { type: "number", minimum: 0 },
          creditPerHour: { type: "number", minimum: 0 },
          eligibleFraction: { type: "number", minimum: 0, maximum: 1 },
          existingCredit: { type: "number", minimum: 0 },
          requiredCredit: { type: "number", minimum: 0 },
        },
        required: [
          "moduleHours",
          "creditPerHour",
          "eligibleFraction",
          "existingCredit",
          "requiredCredit",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          moduleCredit: { type: "number" },
          projectedCredit: { type: "number" },
          remaining: { type: "number" },
        },
        required: ["moduleCredit", "projectedCredit", "remaining"],
      },
      ports: {
        inputs: [
          {
            id: "moduleHours",
            label: "Module Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "creditPerHour",
            label: "Credit Per Hour",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eligibleFraction",
            label: "Eligible Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "existingCredit",
            label: "Existing Credit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "requiredCredit",
            label: "Required Credit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "moduleCredit",
            label: "Module Credit",
            valueType: { type: "number" },
          },
          {
            id: "projectedCredit",
            label: "Projected Credit",
            valueType: { type: "number" },
          },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = qualificationRenewalCreditOneModuleTool.execute;
export default qualificationRenewalCreditOneModuleTool;
