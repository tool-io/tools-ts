import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageYears: number;
  readonly lowerAge: number;
  readonly upperAge: number;
  readonly upperInclusive: boolean;
};
export type Output = { readonly inBand: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageYears: { type: "number", minimum: 0 },
    lowerAge: { type: "number", minimum: 0 },
    upperAge: { type: "number" },
    upperInclusive: { type: "boolean" },
  },
  required: ["ageYears", "lowerAge", "upperAge", "upperInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inBand: { type: "boolean" } },
  required: ["inBand"],
} as const;
/** Apply an explicit age band with inclusive lower edge and configurable upper edge; no ticket provider's age policy is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageYears, lowerAge, upperAge, upperInclusive } = request;
  const compute = (): Output => {
    H.domain(
      ageYears >= 0 && lowerAge >= 0 && upperAge >= lowerAge,
      "ageYears",
    );
    return {
      inBand:
        ageYears >= lowerAge &&
        (upperInclusive ? ageYears <= upperAge : ageYears < upperAge),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageYears: 12, lowerAge: 6, upperAge: 12, upperInclusive: false },
  output: { inBand: false },
} satisfies ToolExample<Input, Output>;
export const ticketAgeBandBoundaryPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/ticket-age-band-boundary-policy",
    title: "Ticket Age Band Boundary Policy Tool",
    description:
      "Apply an explicit age band with inclusive lower edge and configurable upper edge; no ticket provider's age policy is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageYears: { type: "number", minimum: 0 },
        lowerAge: { type: "number", minimum: 0 },
        upperAge: { type: "number" },
        upperInclusive: { type: "boolean" },
      },
      required: ["ageYears", "lowerAge", "upperAge", "upperInclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inBand: { type: "boolean" } },
      required: ["inBand"],
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
          id: "upperAge",
          label: "Upper Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperInclusive",
          label: "Upper Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inBand", label: "In Band", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ticketAgeBandBoundaryPolicyTool.execute;
export default ticketAgeBandBoundaryPolicyTool;
