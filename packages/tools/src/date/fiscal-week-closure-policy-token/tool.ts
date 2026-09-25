import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weekEndDay: number;
  readonly fiscalEndDay: number;
  readonly crossingPolicy: string;
};
export type Output = { readonly crosses: boolean; readonly owner: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weekEndDay: { type: "integer", minimum: 1, maximum: 7 },
    fiscalEndDay: { type: "integer", minimum: 1, maximum: 7 },
    crossingPolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["closing-year", "opening-year"],
    },
  },
  required: ["weekEndDay", "fiscalEndDay", "crossingPolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crosses: { type: "boolean" },
    owner: { type: "string", maxLength: 8192 },
  },
  required: ["crosses", "owner"],
} as const;
/** Compare supplied positions in the same numbered boundary week and retain the supplied ownership policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weekEndDay, fiscalEndDay, crossingPolicy } = request;
  const compute = (): Output => {
    H.integer(weekEndDay, 1, 7);
    H.integer(fiscalEndDay, 1, 7);
    H.domain(["closing-year", "opening-year"].includes(crossingPolicy));
    const crosses = weekEndDay > fiscalEndDay;
    return { crosses, owner: crosses ? crossingPolicy : "current-year" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weekEndDay: 7, fiscalEndDay: 5, crossingPolicy: "closing-year" },
  output: { crosses: true, owner: "closing-year" },
} satisfies ToolExample<Input, Output>;
export const fiscalWeekClosurePolicyTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/fiscal-week-closure-policy-token",
    title: "Fiscal Week Closure Policy Token Tool",
    description:
      "Compare supplied positions in the same numbered boundary week and retain the supplied ownership policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weekEndDay: { type: "integer", minimum: 1, maximum: 7 },
        fiscalEndDay: { type: "integer", minimum: 1, maximum: 7 },
        crossingPolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["closing-year", "opening-year"],
        },
      },
      required: ["weekEndDay", "fiscalEndDay", "crossingPolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crosses: { type: "boolean" },
        owner: { type: "string", maxLength: 8192 },
      },
      required: ["crosses", "owner"],
    },
    ports: {
      inputs: [
        {
          id: "weekEndDay",
          label: "Week End Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fiscalEndDay",
          label: "Fiscal End Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "crossingPolicy",
          label: "Crossing Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "crosses", label: "Crosses", valueType: { type: "boolean" } },
        { id: "owner", label: "Owner", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = fiscalWeekClosurePolicyTokenTool.execute;
export default fiscalWeekClosurePolicyTokenTool;
