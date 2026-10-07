import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageMinutes: number;
  readonly allowedMinutes: number;
};
export type Output = {
  readonly excessMinutes: number;
  readonly stale: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageMinutes: { type: "number", minimum: 0 },
    allowedMinutes: { type: "number", minimum: 0 },
  },
  required: ["ageMinutes", "allowedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { excessMinutes: { type: "number" }, stale: { type: "boolean" } },
  required: ["excessMinutes", "stale"],
} as const;
/** Compare supplied data age with an explicit inclusive freshness allowance and report nonnegative excess. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageMinutes, allowedMinutes } = request;
  const compute = (): Output => {
    H.domain(ageMinutes >= 0, "ageMinutes");
    H.domain(allowedMinutes >= 0, "allowedMinutes");
    return {
      excessMinutes: Math.max(0, ageMinutes - allowedMinutes),
      stale: ageMinutes > allowedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageMinutes: 20, allowedMinutes: 15 },
  output: { excessMinutes: 5, stale: true },
} satisfies ToolExample<Input, Output>;
export const dataRefreshStalenessExcessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/data-refresh-staleness-excess",
    title: "Data Refresh Staleness Excess",
    description:
      "Compare supplied data age with an explicit inclusive freshness allowance and report nonnegative excess.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageMinutes: { type: "number", minimum: 0 },
        allowedMinutes: { type: "number", minimum: 0 },
      },
      required: ["ageMinutes", "allowedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excessMinutes: { type: "number" },
        stale: { type: "boolean" },
      },
      required: ["excessMinutes", "stale"],
    },
    ports: {
      inputs: [
        {
          id: "ageMinutes",
          label: "Age Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedMinutes",
          label: "Allowed Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "excessMinutes",
          label: "Excess Minutes",
          valueType: { type: "number" },
        },
        { id: "stale", label: "Stale", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dataRefreshStalenessExcessTool.execute;
export default dataRefreshStalenessExcessTool;
