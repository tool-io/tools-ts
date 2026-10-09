import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredHours: number;
  readonly providedNonoverlappingHours: number;
};
export type Output = {
  readonly coverageMargin: number;
  readonly unmetHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredHours: { type: "number", minimum: 0 },
    providedNonoverlappingHours: { type: "number", minimum: 0 },
  },
  required: ["requiredHours", "providedNonoverlappingHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coverageMargin: { type: "number" },
    unmetHours: { type: "number" },
  },
  required: ["coverageMargin", "unmetHours"],
} as const;
/** Compare explicitly supplied nonoverlapping caregiver coverage hours with a caller-defined requirement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredHours, providedNonoverlappingHours } = request;
  const compute = (): Output => {
    H.domain(
      requiredHours >= 0 && providedNonoverlappingHours >= 0,
      "requiredHours",
    );
    return {
      coverageMargin: providedNonoverlappingHours - requiredHours,
      unmetHours: Math.max(0, requiredHours - providedNonoverlappingHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredHours: 8, providedNonoverlappingHours: 6 },
  output: { coverageMargin: -2, unmetHours: 2 },
} satisfies ToolExample<Input, Output>;
export const caregiverHourCoverageMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["geriatrics", "health and medicine"],
      keywords: ["geriatrics", "health and medicine"],
    },
    id: "geriatrics/caregiver-hour-coverage-margin",
    title: "Caregiver Hour Coverage Margin",
    description:
      "Compare explicitly supplied nonoverlapping caregiver coverage hours with a caller-defined requirement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredHours: { type: "number", minimum: 0 },
        providedNonoverlappingHours: { type: "number", minimum: 0 },
      },
      required: ["requiredHours", "providedNonoverlappingHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coverageMargin: { type: "number" },
        unmetHours: { type: "number" },
      },
      required: ["coverageMargin", "unmetHours"],
    },
    ports: {
      inputs: [
        {
          id: "requiredHours",
          label: "Required Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "providedNonoverlappingHours",
          label: "Provided Nonoverlapping Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coverageMargin",
          label: "Coverage Margin",
          valueType: { type: "number" },
        },
        {
          id: "unmetHours",
          label: "Unmet Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = caregiverHourCoverageMarginTool.execute;
export default caregiverHourCoverageMarginTool;
