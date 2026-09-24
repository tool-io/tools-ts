import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocated: readonly number[];
  readonly target: readonly number[];
};
export type Output = { readonly gaps: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocated: { type: "array", maxItems: 256, items: { type: "integer" } },
    target: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["allocated", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gaps: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["gaps"],
} as const;
/** Compare explicit research allocation counts with supplied arm targets without recommending randomization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocated, target } = request;
  const compute = (): Output => {
    H.sameLength(allocated, target);
    H.domain([...allocated, ...target].every((x) => x >= 0));
    return { gaps: allocated.map((x, i) => x - target[i]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocated: [12, 8], target: [10, 10] },
  output: { gaps: [2, -2] },
} satisfies ToolExample<Input, Output>;
export const allocationArmCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/allocation-arm-count-gap",
    title: "Allocation Arm Count Gap Tool",
    description:
      "Compare explicit research allocation counts with supplied arm targets without recommending randomization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocated: { type: "array", maxItems: 256, items: { type: "integer" } },
        target: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["allocated", "target"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gaps: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["gaps"],
    },
    ports: {
      inputs: [
        {
          id: "allocated",
          label: "Allocated",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "gaps",
          label: "Gaps",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = allocationArmCountGapTool.execute;
export default allocationArmCountGapTool;
