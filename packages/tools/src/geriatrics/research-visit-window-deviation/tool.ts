import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitDay: number;
  readonly targetDay: number;
  readonly suppliedToleranceDays: number;
};
export type Output = {
  readonly deviationDays: number;
  readonly outsideByDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitDay: { type: "integer" },
    targetDay: { type: "integer" },
    suppliedToleranceDays: { type: "integer", minimum: 0 },
  },
  required: ["visitDay", "targetDay", "suppliedToleranceDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviationDays: { type: "integer" },
    outsideByDays: { type: "integer" },
  },
  required: ["deviationDays", "outsideByDays"],
} as const;
/** Research visit record-window arithmetic without evaluating care suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitDay, targetDay, suppliedToleranceDays } = request;
  const compute = (): Output => {
    H.integer(suppliedToleranceDays, 0);
    return {
      deviationDays: visitDay - targetDay,
      outsideByDays: Math.max(
        0,
        Math.abs(visitDay - targetDay) - suppliedToleranceDays,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visitDay: 110, targetDay: 100, suppliedToleranceDays: 5 },
  output: { deviationDays: 10, outsideByDays: 5 },
} satisfies ToolExample<Input, Output>;
export const researchVisitWindowDeviationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/research-visit-window-deviation",
    title: "Research Visit Window Deviation Tool",
    description:
      "Research visit record-window arithmetic without evaluating care suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitDay: { type: "integer" },
        targetDay: { type: "integer" },
        suppliedToleranceDays: { type: "integer", minimum: 0 },
      },
      required: ["visitDay", "targetDay", "suppliedToleranceDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviationDays: { type: "integer" },
        outsideByDays: { type: "integer" },
      },
      required: ["deviationDays", "outsideByDays"],
    },
    ports: {
      inputs: [
        {
          id: "visitDay",
          label: "Visit Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetDay",
          label: "Target Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedToleranceDays",
          label: "Supplied Tolerance Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "deviationDays",
          label: "Deviation Days",
          valueType: { type: "integer" },
        },
        {
          id: "outsideByDays",
          label: "Outside By Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchVisitWindowDeviationTool.execute;
export default researchVisitWindowDeviationTool;
