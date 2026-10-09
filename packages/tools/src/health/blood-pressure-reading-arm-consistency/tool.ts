import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly armLabels: readonly string[];
  readonly allowedArmLabels: readonly string[];
};
export type Output = {
  readonly consistent: boolean;
  readonly unknownLabels: readonly string[];
  readonly distinctRecordedLabels: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    armLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allowedArmLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["armLabels", "allowedArmLabels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consistent: { type: "boolean" },
    unknownLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    distinctRecordedLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["consistent", "unknownLabels", "distinctRecordedLabels"],
} as const;
/** Compare explicit blood-pressure record arm labels against a supplied vocabulary without interpreting readings or choosing an arm. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { armLabels, allowedArmLabels } = request;
  const compute = (): Output => {
    return (() => {
      const distinctRecordedLabels = [...new Set(armLabels)];
      return {
        consistent:
          distinctRecordedLabels.length === 1 &&
          allowedArmLabels.includes(distinctRecordedLabels[0]),
        unknownLabels: distinctRecordedLabels.filter(
          (label) => !allowedArmLabels.includes(label),
        ),
        distinctRecordedLabels,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { armLabels: ["left", "left"], allowedArmLabels: ["left", "right"] },
  output: {
    consistent: true,
    unknownLabels: [],
    distinctRecordedLabels: ["left"],
  },
} satisfies ToolExample<Input, Output>;
export const bloodPressureReadingArmConsistencyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health", "health and medicine"],
      keywords: ["health", "health and medicine"],
    },
    id: "health/blood-pressure-reading-arm-consistency",
    title: "Blood Pressure Reading Arm Consistency",
    description:
      "Compare explicit blood-pressure record arm labels against a supplied vocabulary without interpreting readings or choosing an arm.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        armLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        allowedArmLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["armLabels", "allowedArmLabels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consistent: { type: "boolean" },
        unknownLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        distinctRecordedLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["consistent", "unknownLabels", "distinctRecordedLabels"],
    },
    ports: {
      inputs: [
        {
          id: "armLabels",
          label: "Arm Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "allowedArmLabels",
          label: "Allowed Arm Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "consistent",
          label: "Consistent",
          valueType: { type: "boolean" },
        },
        {
          id: "unknownLabels",
          label: "Unknown Labels",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "distinctRecordedLabels",
          label: "Distinct Recorded Labels",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = bloodPressureReadingArmConsistencyTool.execute;
export default bloodPressureReadingArmConsistencyTool;
