import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effectiveFrom: number;
  readonly effectiveUntil: number;
  readonly queriedAt: number;
};
export type Output = {
  readonly fromStart: number;
  readonly untilEnd: number;
  readonly active: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveFrom: { type: "number" },
    effectiveUntil: { type: "number" },
    queriedAt: { type: "number" },
  },
  required: ["effectiveFrom", "effectiveUntil", "queriedAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fromStart: { type: "number" },
    untilEnd: { type: "number" },
    active: { type: "boolean" },
  },
  required: ["fromStart", "untilEnd", "active"],
} as const;
/** Inspect supplied public code-era endpoints without a territory or geopolitical dataset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effectiveFrom, effectiveUntil, queriedAt } = request;
  const compute = (): Output => {
    H.domain(effectiveUntil >= effectiveFrom);
    return {
      fromStart: queriedAt - effectiveFrom,
      untilEnd: effectiveUntil - queriedAt,
      active: queriedAt >= effectiveFrom && queriedAt < effectiveUntil,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effectiveFrom: 10, effectiveUntil: 20, queriedAt: 15 },
  output: { fromStart: 5, untilEnd: 5, active: true },
} satisfies ToolExample<Input, Output>;
export const territoryCodeEffectiveGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/territory-code-effective-gap",
    title: "Territory Code Effective Gap Tool",
    description:
      "Inspect supplied public code-era endpoints without a territory or geopolitical dataset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveFrom: { type: "number" },
        effectiveUntil: { type: "number" },
        queriedAt: { type: "number" },
      },
      required: ["effectiveFrom", "effectiveUntil", "queriedAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fromStart: { type: "number" },
        untilEnd: { type: "number" },
        active: { type: "boolean" },
      },
      required: ["fromStart", "untilEnd", "active"],
    },
    ports: {
      inputs: [
        {
          id: "effectiveFrom",
          label: "Effective From",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "effectiveUntil",
          label: "Effective Until",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "queriedAt",
          label: "Queried At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fromStart", label: "From Start", valueType: { type: "number" } },
        { id: "untilEnd", label: "Until End", valueType: { type: "number" } },
        { id: "active", label: "Active", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = territoryCodeEffectiveGapTool.execute;
export default territoryCodeEffectiveGapTool;
