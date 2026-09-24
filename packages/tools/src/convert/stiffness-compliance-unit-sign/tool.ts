import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stiffness: number;
  readonly targetCompliancePerBaseCompliance: number;
};
export type Output = {
  readonly baseCompliance: number;
  readonly convertedCompliance: number;
  readonly sign: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stiffness: { type: "number" },
    targetCompliancePerBaseCompliance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["stiffness", "targetCompliancePerBaseCompliance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseCompliance: { type: "number" },
    convertedCompliance: { type: "number" },
    sign: { type: "integer" },
  },
  required: ["baseCompliance", "convertedCompliance", "sign"],
} as const;
/** Signed reciprocal stiffness and an explicit positive compliance-unit conversion factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stiffness, targetCompliancePerBaseCompliance } = request;
  const compute = (): Output => {
    H.domain(stiffness !== 0);
    H.positive(targetCompliancePerBaseCompliance);
    return {
      baseCompliance: 1 / stiffness,
      convertedCompliance: targetCompliancePerBaseCompliance / stiffness,
      sign: Math.sign(stiffness),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stiffness: 4, targetCompliancePerBaseCompliance: 1000 },
  output: { baseCompliance: 0.25, convertedCompliance: 250, sign: 1 },
} satisfies ToolExample<Input, Output>;
export const stiffnessComplianceUnitSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/stiffness-compliance-unit-sign",
    title: "Stiffness Compliance Unit Sign Tool",
    description:
      "Signed reciprocal stiffness and an explicit positive compliance-unit conversion factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stiffness: { type: "number" },
        targetCompliancePerBaseCompliance: {
          type: "number",
          exclusiveMinimum: 0,
        },
      },
      required: ["stiffness", "targetCompliancePerBaseCompliance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseCompliance: { type: "number" },
        convertedCompliance: { type: "number" },
        sign: { type: "integer" },
      },
      required: ["baseCompliance", "convertedCompliance", "sign"],
    },
    ports: {
      inputs: [
        {
          id: "stiffness",
          label: "Stiffness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetCompliancePerBaseCompliance",
          label: "Target Compliance Per Base Compliance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baseCompliance",
          label: "Base Compliance",
          valueType: { type: "number" },
        },
        {
          id: "convertedCompliance",
          label: "Converted Compliance",
          valueType: { type: "number" },
        },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = stiffnessComplianceUnitSignTool.execute;
export default stiffnessComplianceUnitSignTool;
