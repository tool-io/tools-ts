import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly pressures: readonly number[] };
export type Output = { readonly duplicate: readonly boolean[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressures: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["pressures"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duplicate: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["duplicate"],
} as const;
/** Flag repeated exact pressure values after their first occurrence in a sounding, without imposing a sorting convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressures } = request;
  const compute = (): Output => {
    pressures.forEach(H.positive);
    const seen = new Set<number>();
    return {
      duplicate: pressures.map((v) => {
        const duplicate = seen.has(v);
        seen.add(v);
        return duplicate;
      }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressures: [1000, 900, 900, 800] },
  output: { duplicate: [false, false, true, false] },
} satisfies ToolExample<Input, Output>;
export const soundingLevelDuplicatePressureFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/sounding-level-duplicate-pressure-flag",
    title: "Sounding Level Duplicate Pressure Flag Tool",
    description:
      "Flag repeated exact pressure values after their first occurrence in a sounding, without imposing a sorting convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressures: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["pressures"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duplicate: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["duplicate"],
    },
    ports: {
      inputs: [
        {
          id: "pressures",
          label: "Pressures",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "duplicate",
          label: "Duplicate",
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
    },
  },
  calculate,
});
export const run = soundingLevelDuplicatePressureFlagTool.execute;
export default soundingLevelDuplicatePressureFlagTool;
