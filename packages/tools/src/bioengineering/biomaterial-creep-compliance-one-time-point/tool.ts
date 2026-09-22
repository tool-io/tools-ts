import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly strain: number;
  readonly appliedStress: number;
  readonly initialStrain: number;
};
export type Output = {
  readonly compliance: number;
  readonly incrementalCompliance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strain: { type: "number" },
    appliedStress: { type: "number" },
    initialStrain: { type: "number" },
  },
  required: ["strain", "appliedStress", "initialStrain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compliance: { type: "number" },
    incrementalCompliance: { type: "number" },
  },
  required: ["compliance", "incrementalCompliance"],
} as const;
/** One constant-stress creep observation; signed stress and strain must share the caller-selected convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strain, appliedStress, initialStrain } = request;
  const compute = (): Output => {
    H.domain(appliedStress !== 0);
    return {
      compliance: strain / appliedStress,
      incrementalCompliance: (strain - initialStrain) / appliedStress,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { strain: 0.2, appliedStress: 10, initialStrain: 0.05 },
  output: { compliance: 0.02, incrementalCompliance: 0.015000000000000003 },
} satisfies ToolExample<Input, Output>;
export const biomaterialCreepComplianceOneTimePointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioengineering/biomaterial-creep-compliance-one-time-point",
      title: "Biomaterial Creep Compliance One Time Point Tool",
      description:
        "One constant-stress creep observation; signed stress and strain must share the caller-selected convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          strain: { type: "number" },
          appliedStress: { type: "number" },
          initialStrain: { type: "number" },
        },
        required: ["strain", "appliedStress", "initialStrain"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          compliance: { type: "number" },
          incrementalCompliance: { type: "number" },
        },
        required: ["compliance", "incrementalCompliance"],
      },
      ports: {
        inputs: [
          {
            id: "strain",
            label: "Strain",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "appliedStress",
            label: "Applied Stress",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialStrain",
            label: "Initial Strain",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "compliance",
            label: "Compliance",
            valueType: { type: "number" },
          },
          {
            id: "incrementalCompliance",
            label: "Incremental Compliance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biomaterialCreepComplianceOneTimePointTool.execute;
export default biomaterialCreepComplianceOneTimePointTool;
