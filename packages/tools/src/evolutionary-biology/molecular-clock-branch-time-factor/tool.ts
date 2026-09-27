import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly substitutionsPerSite: number;
  readonly ratePerSitePerYear: number;
  readonly twoLineages: boolean;
};
export type Output = { readonly years: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    substitutionsPerSite: { type: "number", minimum: 0 },
    ratePerSitePerYear: { type: "number", exclusiveMinimum: 0 },
    twoLineages: { type: "boolean" },
  },
  required: ["substitutionsPerSite", "ratePerSitePerYear", "twoLineages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { years: { type: "number" } },
  required: ["years"],
} as const;
/** Strict-clock duration from a single branch or symmetric two-lineage divergence, with an explicit supplied rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { substitutionsPerSite, ratePerSitePerYear, twoLineages } = request;
  const compute = (): Output => {
    H.domain(substitutionsPerSite >= 0);
    H.positive(ratePerSitePerYear);
    return {
      years:
        substitutionsPerSite / (ratePerSitePerYear * (twoLineages ? 2 : 1)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    substitutionsPerSite: 0.02,
    ratePerSitePerYear: 0.000001,
    twoLineages: true,
  },
  output: { years: 10000 },
} satisfies ToolExample<Input, Output>;
export const molecularClockBranchTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/molecular-clock-branch-time-factor",
    title: "Molecular Clock Branch Time Factor Tool",
    description:
      "Strict-clock duration from a single branch or symmetric two-lineage divergence, with an explicit supplied rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        substitutionsPerSite: { type: "number", minimum: 0 },
        ratePerSitePerYear: { type: "number", exclusiveMinimum: 0 },
        twoLineages: { type: "boolean" },
      },
      required: ["substitutionsPerSite", "ratePerSitePerYear", "twoLineages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { years: { type: "number" } },
      required: ["years"],
    },
    ports: {
      inputs: [
        {
          id: "substitutionsPerSite",
          label: "Substitutions Per Site",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratePerSitePerYear",
          label: "Rate Per Site Per Year",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "twoLineages",
          label: "Two Lineages",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "years", label: "Years", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = molecularClockBranchTimeFactorTool.execute;
export default molecularClockBranchTimeFactorTool;
