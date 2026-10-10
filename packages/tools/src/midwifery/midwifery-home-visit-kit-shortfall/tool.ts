import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredCount: number;
  readonly availableCount: number;
};
export type Output = { readonly shortfall: number; readonly surplus: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCount: { type: "integer", minimum: 0 },
    availableCount: { type: "integer", minimum: 0 },
  },
  required: ["requiredCount", "availableCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shortfall: { type: "integer" }, surplus: { type: "integer" } },
  required: ["shortfall", "surplus"],
} as const;
/** Compare explicit home-visit kit counts without deciding kit requirements or suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredCount, availableCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(requiredCount) &&
        requiredCount >= 0 &&
        requiredCount <= Number.MAX_SAFE_INTEGER,
      "requiredCount",
    ),
      requiredCount);
    (H.domain(
      Number.isSafeInteger(availableCount) &&
        availableCount >= 0 &&
        availableCount <= Number.MAX_SAFE_INTEGER,
      "availableCount",
    ),
      availableCount);
    return {
      shortfall: Math.max(0, requiredCount - availableCount),
      surplus: Math.max(0, availableCount - requiredCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredCount: 12, availableCount: 10 },
  output: { shortfall: 2, surplus: 0 },
} satisfies ToolExample<Input, Output>;
export const midwiferyHomeVisitKitShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["midwifery", "health and medicine"],
      keywords: ["midwifery", "health and medicine"],
    },
    id: "midwifery/midwifery-home-visit-kit-shortfall",
    title: "Midwifery Home Visit Kit Shortfall",
    description:
      "Compare explicit home-visit kit counts without deciding kit requirements or suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCount: { type: "integer", minimum: 0 },
        availableCount: { type: "integer", minimum: 0 },
      },
      required: ["requiredCount", "availableCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "integer" },
        surplus: { type: "integer" },
      },
      required: ["shortfall", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "requiredCount",
          label: "Required Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "availableCount",
          label: "Available Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
        { id: "surplus", label: "Surplus", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = midwiferyHomeVisitKitShortfallTool.execute;
export default midwiferyHomeVisitKitShortfallTool;
