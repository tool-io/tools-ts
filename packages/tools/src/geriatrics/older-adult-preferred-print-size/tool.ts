import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preferredPoints: number;
  readonly availablePoints: readonly number[];
};
export type Output = {
  readonly exactAvailable: boolean;
  readonly closestPoints: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferredPoints: { type: "number", exclusiveMinimum: 0 },
    availablePoints: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["preferredPoints", "availablePoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exactAvailable: { type: "boolean" },
    closestPoints: { type: "number" },
  },
  required: ["exactAvailable", "closestPoints"],
} as const;
/** Find an explicitly preferred print size in supplied options, choosing the first option on equal-distance ties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preferredPoints, availablePoints } = request;
  const compute = (): Output => {
    (H.domain(preferredPoints > 0, "preferredPoints"), preferredPoints);
    H.domain(
      availablePoints.length > 0 && availablePoints.every((x) => x > 0),
      "availablePoints",
    );
    return (() => {
      const closestPoints = availablePoints.reduce((best, x) =>
        Math.abs(x - preferredPoints) < Math.abs(best - preferredPoints)
          ? x
          : best,
      );
      return {
        exactAvailable: availablePoints.includes(preferredPoints),
        closestPoints,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preferredPoints: 18, availablePoints: [12, 16, 20] },
  output: { exactAvailable: false, closestPoints: 16 },
} satisfies ToolExample<Input, Output>;
export const olderadultPreferredPrintSizeTool = H.defineSchemaCalculation<
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
    id: "geriatrics/older-adult-preferred-print-size",
    title: "Older Adult Preferred Print Size",
    description:
      "Find an explicitly preferred print size in supplied options, choosing the first option on equal-distance ties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferredPoints: { type: "number", exclusiveMinimum: 0 },
        availablePoints: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["preferredPoints", "availablePoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exactAvailable: { type: "boolean" },
        closestPoints: { type: "number" },
      },
      required: ["exactAvailable", "closestPoints"],
    },
    ports: {
      inputs: [
        {
          id: "preferredPoints",
          label: "Preferred Points",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availablePoints",
          label: "Available Points",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "exactAvailable",
          label: "Exact Available",
          valueType: { type: "boolean" },
        },
        {
          id: "closestPoints",
          label: "Closest Points",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = olderadultPreferredPrintSizeTool.execute;
export default olderadultPreferredPrintSizeTool;
