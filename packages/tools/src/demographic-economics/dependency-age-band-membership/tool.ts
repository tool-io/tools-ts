import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageYears: number;
  readonly lowerAge: number;
  readonly upperAgeExclusive: number;
};
export type Output = { readonly inSuppliedBand: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageYears: { type: "number", minimum: 0 },
    lowerAge: { type: "number", minimum: 0 },
    upperAgeExclusive: { type: "number" },
  },
  required: ["ageYears", "lowerAge", "upperAgeExclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inSuppliedBand: { type: "boolean" } },
  required: ["inSuppliedBand"],
} as const;
/** Apply an explicit half-open dependency age band without selecting a jurisdiction’s demographic convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageYears, lowerAge, upperAgeExclusive } = request;
  const compute = (): Output => {
    H.domain(
      ageYears >= 0 && lowerAge >= 0 && upperAgeExclusive > lowerAge,
      "ageYears",
    );
    return {
      inSuppliedBand: ageYears >= lowerAge && ageYears < upperAgeExclusive,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageYears: 14, lowerAge: 0, upperAgeExclusive: 15 },
  output: { inSuppliedBand: true },
} satisfies ToolExample<Input, Output>;
export const dependencyAgeBandMembershipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["demographic-economics", "demographic economics", "economics"],
      keywords: ["demographic economics", "economics"],
    },
    id: "demographic-economics/dependency-age-band-membership",
    title: "Dependency Age Band Membership",
    description:
      "Apply an explicit half-open dependency age band without selecting a jurisdiction’s demographic convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageYears: { type: "number", minimum: 0 },
        lowerAge: { type: "number", minimum: 0 },
        upperAgeExclusive: { type: "number" },
      },
      required: ["ageYears", "lowerAge", "upperAgeExclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inSuppliedBand: { type: "boolean" } },
      required: ["inSuppliedBand"],
    },
    ports: {
      inputs: [
        {
          id: "ageYears",
          label: "Age Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerAge",
          label: "Lower Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperAgeExclusive",
          label: "Upper Age Exclusive",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "inSuppliedBand",
          label: "In Supplied Band",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dependencyAgeBandMembershipTool.execute;
export default dependencyAgeBandMembershipTool;
