import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedAge: number;
  readonly minimumAge: number;
  readonly maximumAge: number;
  readonly includeMinimum: boolean;
  readonly includeMaximum: boolean;
};
export type Output = { readonly withinSuppliedAgeRule: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedAge: { type: "number", minimum: 0 },
    minimumAge: { type: "number", minimum: 0 },
    maximumAge: { type: "number" },
    includeMinimum: { type: "boolean" },
    includeMaximum: { type: "boolean" },
  },
  required: [
    "suppliedAge",
    "minimumAge",
    "maximumAge",
    "includeMinimum",
    "includeMaximum",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinSuppliedAgeRule: { type: "boolean" } },
  required: ["withinSuppliedAgeRule"],
} as const;
/** Apply explicit age bounds and endpoint policies to a supplied age without calculating legal age or deciding program eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    suppliedAge,
    minimumAge,
    maximumAge,
    includeMinimum,
    includeMaximum,
  } = request;
  const compute = (): Output => {
    H.domain(
      suppliedAge >= 0 && minimumAge >= 0 && maximumAge >= minimumAge,
      "suppliedAge",
    );
    return {
      withinSuppliedAgeRule:
        (includeMinimum
          ? suppliedAge >= minimumAge
          : suppliedAge > minimumAge) &&
        (includeMaximum ? suppliedAge <= maximumAge : suppliedAge < maximumAge),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedAge: 18,
    minimumAge: 18,
    maximumAge: 65,
    includeMinimum: true,
    includeMaximum: false,
  },
  output: { withinSuppliedAgeRule: true },
} satisfies ToolExample<Input, Output>;
export const policyEligibilityAgeBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["public-policy", "public policy", "social sciences"],
      keywords: ["public policy", "social sciences"],
    },
    id: "public-policy/policy-eligibility-age-boundary",
    title: "Policy Eligibility Age Boundary",
    description:
      "Apply explicit age bounds and endpoint policies to a supplied age without calculating legal age or deciding program eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedAge: { type: "number", minimum: 0 },
        minimumAge: { type: "number", minimum: 0 },
        maximumAge: { type: "number" },
        includeMinimum: { type: "boolean" },
        includeMaximum: { type: "boolean" },
      },
      required: [
        "suppliedAge",
        "minimumAge",
        "maximumAge",
        "includeMinimum",
        "includeMaximum",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinSuppliedAgeRule: { type: "boolean" } },
      required: ["withinSuppliedAgeRule"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedAge",
          label: "Supplied Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumAge",
          label: "Minimum Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumAge",
          label: "Maximum Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeMinimum",
          label: "Include Minimum",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeMaximum",
          label: "Include Maximum",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "withinSuppliedAgeRule",
          label: "Within Supplied Age Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyEligibilityAgeBoundaryTool.execute;
export default policyEligibilityAgeBoundaryTool;
