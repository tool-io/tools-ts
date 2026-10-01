import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gestationalDaysAtBirth: number;
  readonly postnatalDays: number;
  readonly referenceDays: number;
};
export type Output = {
  readonly suppliedCombinedDays: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gestationalDaysAtBirth: { type: "number", minimum: 0 },
    postnatalDays: { type: "number", minimum: 0 },
    referenceDays: { type: "number", minimum: 0 },
  },
  required: ["gestationalDaysAtBirth", "postnatalDays", "referenceDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedCombinedDays: { type: "number" },
    gap: { type: "number" },
  },
  required: ["suppliedCombinedDays", "gap"],
} as const;
/** Add explicit research age coordinates and compare to a reference without clinical maturity classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gestationalDaysAtBirth, postnatalDays, referenceDays } = request;
  const compute = (): Output => {
    H.domain(
      gestationalDaysAtBirth >= 0 && postnatalDays >= 0 && referenceDays >= 0,
    );
    return {
      suppliedCombinedDays: gestationalDaysAtBirth + postnatalDays,
      gap: gestationalDaysAtBirth + postnatalDays - referenceDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gestationalDaysAtBirth: 196, postnatalDays: 14, referenceDays: 200 },
  output: { suppliedCombinedDays: 210, gap: 10 },
} satisfies ToolExample<Input, Output>;
export const postmenstrualAgeReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/postmenstrual-age-reference-gap",
    title: "Postmenstrual Age Reference Gap Tool",
    description:
      "Add explicit research age coordinates and compare to a reference without clinical maturity classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gestationalDaysAtBirth: { type: "number", minimum: 0 },
        postnatalDays: { type: "number", minimum: 0 },
        referenceDays: { type: "number", minimum: 0 },
      },
      required: ["gestationalDaysAtBirth", "postnatalDays", "referenceDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedCombinedDays: { type: "number" },
        gap: { type: "number" },
      },
      required: ["suppliedCombinedDays", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "gestationalDaysAtBirth",
          label: "Gestational Days At Birth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "postnatalDays",
          label: "Postnatal Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDays",
          label: "Reference Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "suppliedCombinedDays",
          label: "Supplied Combined Days",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = postmenstrualAgeReferenceGapTool.execute;
export default postmenstrualAgeReferenceGapTool;
