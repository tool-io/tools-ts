import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredHours: number;
  readonly informalHours: number;
  readonly formalHours: number;
  readonly formalHourlyCost: number;
};
export type Output = {
  readonly uncoveredHours: number;
  readonly paidCost: number;
  readonly coveredFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredHours: { type: "number", exclusiveMinimum: 0 },
    informalHours: { type: "number", minimum: 0 },
    formalHours: { type: "number", minimum: 0 },
    formalHourlyCost: { type: "number", minimum: 0 },
  },
  required: [
    "requiredHours",
    "informalHours",
    "formalHours",
    "formalHourlyCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncoveredHours: { type: "number" },
    paidCost: { type: "number" },
    coveredFraction: { type: "number" },
  },
  required: ["uncoveredHours", "paidCost", "coveredFraction"],
} as const;
/** Caller-estimated care-hour coverage and formal cost; hours are not a clinical needs assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredHours, informalHours, formalHours, formalHourlyCost } =
    request;
  const compute = (): Output => {
    H.positive(requiredHours);
    H.domain(informalHours >= 0 && formalHours >= 0 && formalHourlyCost >= 0);
    return {
      uncoveredHours: Math.max(0, requiredHours - informalHours - formalHours),
      paidCost: formalHours * formalHourlyCost,
      coveredFraction: Math.min(
        1,
        (informalHours + formalHours) / requiredHours,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredHours: 40,
    informalHours: 15,
    formalHours: 20,
    formalHourlyCost: 25,
  },
  output: { uncoveredHours: 5, paidCost: 500, coveredFraction: 0.875 },
} satisfies ToolExample<Input, Output>;
export const eldercareInformalFormalHourGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/eldercare-informal-formal-hour-gap",
    title: "Eldercare Informal Formal Hour Gap Tool",
    description:
      "Caller-estimated care-hour coverage and formal cost; hours are not a clinical needs assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredHours: { type: "number", exclusiveMinimum: 0 },
        informalHours: { type: "number", minimum: 0 },
        formalHours: { type: "number", minimum: 0 },
        formalHourlyCost: { type: "number", minimum: 0 },
      },
      required: [
        "requiredHours",
        "informalHours",
        "formalHours",
        "formalHourlyCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncoveredHours: { type: "number" },
        paidCost: { type: "number" },
        coveredFraction: { type: "number" },
      },
      required: ["uncoveredHours", "paidCost", "coveredFraction"],
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
          id: "informalHours",
          label: "Informal Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "formalHours",
          label: "Formal Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "formalHourlyCost",
          label: "Formal Hourly Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uncoveredHours",
          label: "Uncovered Hours",
          valueType: { type: "number" },
        },
        { id: "paidCost", label: "Paid Cost", valueType: { type: "number" } },
        {
          id: "coveredFraction",
          label: "Covered Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eldercareInformalFormalHourGapTool.execute;
export default eldercareInformalFormalHourGapTool;
