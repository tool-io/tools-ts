import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly requiredUnit: string;
  readonly permittedOmission: boolean;
};
export type Output = {
  readonly unitPresent: boolean;
  readonly ambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    requiredUnit: { type: "string", maxLength: 8192 },
    permittedOmission: { type: "boolean" },
  },
  required: ["token", "requiredUnit", "permittedOmission"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitPresent: { type: "boolean" },
    ambiguous: { type: "boolean" },
  },
  required: ["unitPresent", "ambiguous"],
} as const;
/** Check an explicitly required unit token without parsing or guessing a Chinese numeric value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, requiredUnit, permittedOmission } = request;
  const compute = (): Output => {
    H.domain(requiredUnit.length > 0);
    const unitPresent = token.includes(requiredUnit);
    return { unitPresent, ambiguous: !unitPresent && !permittedOmission };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "三百", requiredUnit: "百", permittedOmission: false },
  output: { unitPresent: true, ambiguous: false },
} satisfies ToolExample<Input, Output>;
export const chineseNumberUnitOmissionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/chinese-number-unit-omission",
    title: "Chinese Number Unit Omission Tool",
    description:
      "Check an explicitly required unit token without parsing or guessing a Chinese numeric value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        requiredUnit: { type: "string", maxLength: 8192 },
        permittedOmission: { type: "boolean" },
      },
      required: ["token", "requiredUnit", "permittedOmission"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitPresent: { type: "boolean" },
        ambiguous: { type: "boolean" },
      },
      required: ["unitPresent", "ambiguous"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requiredUnit",
          label: "Required Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permittedOmission",
          label: "Permitted Omission",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "unitPresent",
          label: "Unit Present",
          valueType: { type: "boolean" },
        },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = chineseNumberUnitOmissionTool.execute;
export default chineseNumberUnitOmissionTool;
