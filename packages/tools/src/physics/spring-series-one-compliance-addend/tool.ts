import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stiffness: number;
  readonly existingCompliance: number;
};
export type Output = {
  readonly compliance: number;
  readonly equivalentStiffness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stiffness: { type: "number", exclusiveMinimum: 0 },
    existingCompliance: { type: "number", minimum: 0 },
  },
  required: ["stiffness", "existingCompliance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compliance: { type: "number" },
    equivalentStiffness: { type: "number" },
  },
  required: ["compliance", "equivalentStiffness"],
} as const;
/** Calculate spring series one compliance addend from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stiffness, existingCompliance } = request;
  const compute = (): Output => {
    H.positive(stiffness);
    H.domain(existingCompliance >= 0);
    const compliance = existingCompliance + 1 / stiffness;
    return { compliance, equivalentStiffness: 1 / compliance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stiffness: 200, existingCompliance: 0.005 },
  output: { compliance: 0.01, equivalentStiffness: 100 },
} satisfies ToolExample<Input, Output>;
export const springSeriesOneComplianceAddendTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/spring-series-one-compliance-addend",
    title: "Spring Series One Compliance Addend Tool",
    description:
      "Calculate spring series one compliance addend from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stiffness: { type: "number", exclusiveMinimum: 0 },
        existingCompliance: { type: "number", minimum: 0 },
      },
      required: ["stiffness", "existingCompliance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        compliance: { type: "number" },
        equivalentStiffness: { type: "number" },
      },
      required: ["compliance", "equivalentStiffness"],
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
          id: "existingCompliance",
          label: "Existing Compliance",
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
          id: "equivalentStiffness",
          label: "Equivalent Stiffness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = springSeriesOneComplianceAddendTool.execute;
export default springSeriesOneComplianceAddendTool;
