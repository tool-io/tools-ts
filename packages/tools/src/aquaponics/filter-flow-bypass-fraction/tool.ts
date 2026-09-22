import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bypassFlow: number; readonly totalFlow: number };
export type Output = {
  readonly bypassShare: number;
  readonly treatedFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bypassFlow: { type: "number", minimum: 0 },
    totalFlow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["bypassFlow", "totalFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bypassShare: { type: "number" },
    treatedFlow: { type: "number" },
  },
  required: ["bypassShare", "treatedFlow"],
} as const;
/** Calculate filter flow bypass fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bypassFlow, totalFlow } = request;
  const compute = (): Output => {
    H.positive(totalFlow);
    H.domain(bypassFlow >= 0 && bypassFlow <= totalFlow);
    return {
      bypassShare: bypassFlow / totalFlow,
      treatedFlow: totalFlow - bypassFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bypassFlow: 2, totalFlow: 10 },
  output: { bypassShare: 0.2, treatedFlow: 8 },
} satisfies ToolExample<Input, Output>;
export const filterFlowBypassFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/filter-flow-bypass-fraction",
    title: "Filter Flow Bypass Fraction Tool",
    description:
      "Calculate filter flow bypass fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bypassFlow: { type: "number", minimum: 0 },
        totalFlow: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["bypassFlow", "totalFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bypassShare: { type: "number" },
        treatedFlow: { type: "number" },
      },
      required: ["bypassShare", "treatedFlow"],
    },
    ports: {
      inputs: [
        {
          id: "bypassFlow",
          label: "Bypass Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalFlow",
          label: "Total Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bypassShare",
          label: "Bypass Share",
          valueType: { type: "number" },
        },
        {
          id: "treatedFlow",
          label: "Treated Flow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = filterFlowBypassFractionTool.execute;
export default filterFlowBypassFractionTool;
