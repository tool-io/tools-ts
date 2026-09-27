import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalVolume: number;
  readonly withdrawn: number;
  readonly deadVolume: number;
};
export type Output = {
  readonly remaining: number;
  readonly usable: number;
  readonly empty: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number", minimum: 0 },
    withdrawn: { type: "number", minimum: 0 },
    deadVolume: { type: "number", minimum: 0 },
  },
  required: ["totalVolume", "withdrawn", "deadVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    usable: { type: "number" },
    empty: { type: "boolean" },
  },
  required: ["remaining", "usable", "empty"],
} as const;
/** Supplied research-sample inventory only, without sampling or clinical advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalVolume, withdrawn, deadVolume } = request;
  const compute = (): Output => {
    H.domain(
      totalVolume >= 0 &&
        withdrawn >= 0 &&
        withdrawn <= totalVolume &&
        deadVolume >= 0,
    );
    return {
      remaining: totalVolume - withdrawn,
      usable: Math.max(0, totalVolume - withdrawn - deadVolume),
      empty: totalVolume - withdrawn <= deadVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalVolume: 10, withdrawn: 8, deadVolume: 3 },
  output: { remaining: 2, usable: 0, empty: true },
} satisfies ToolExample<Input, Output>;
export const giSampleAliquotEmptyBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/gi-sample-aliquot-empty-base-flag",
    title: "Gi Sample Aliquot Empty Base Flag Tool",
    description:
      "Supplied research-sample inventory only, without sampling or clinical advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalVolume: { type: "number", minimum: 0 },
        withdrawn: { type: "number", minimum: 0 },
        deadVolume: { type: "number", minimum: 0 },
      },
      required: ["totalVolume", "withdrawn", "deadVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        usable: { type: "number" },
        empty: { type: "boolean" },
      },
      required: ["remaining", "usable", "empty"],
    },
    ports: {
      inputs: [
        {
          id: "totalVolume",
          label: "Total Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withdrawn",
          label: "Withdrawn",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deadVolume",
          label: "Dead Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "usable", label: "Usable", valueType: { type: "number" } },
        { id: "empty", label: "Empty", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = giSampleAliquotEmptyBaseFlagTool.execute;
export default giSampleAliquotEmptyBaseFlagTool;
