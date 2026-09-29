import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly retentionPerDay: number };
export type Output = { readonly halfLifeDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retentionPerDay: {
      type: "number",
      exclusiveMinimum: 0,
      exclusiveMaximum: 1,
    },
  },
  required: ["retentionPerDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { halfLifeDays: { type: "number" } },
  required: ["halfLifeDays"],
} as const;
/** Calculate baseflow recession half life factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retentionPerDay } = request;
  const compute = (): Output => {
    H.domain(retentionPerDay > 0 && retentionPerDay < 1);
    return { halfLifeDays: Math.log(0.5) / Math.log(retentionPerDay) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retentionPerDay: 0.5 },
  output: { halfLifeDays: 1 },
} satisfies ToolExample<Input, Output>;
export const baseflowRecessionHalfLifeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/baseflow-recession-half-life-factor",
    title: "Baseflow Recession Half Life Factor Tool",
    description:
      "Calculate baseflow recession half life factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retentionPerDay: {
          type: "number",
          exclusiveMinimum: 0,
          exclusiveMaximum: 1,
        },
      },
      required: ["retentionPerDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { halfLifeDays: { type: "number" } },
      required: ["halfLifeDays"],
    },
    ports: {
      inputs: [
        {
          id: "retentionPerDay",
          label: "Retention Per Day",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "halfLifeDays",
          label: "Half Life Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = baseflowRecessionHalfLifeFactorTool.execute;
export default baseflowRecessionHalfLifeFactorTool;
