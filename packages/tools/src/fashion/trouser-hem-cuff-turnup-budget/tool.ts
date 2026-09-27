import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly finishedLength: number;
  readonly cuffDepth: number;
  readonly hemAllowance: number;
};
export type Output = { readonly cutLength: number; readonly allowance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finishedLength: { type: "number", minimum: 0 },
    cuffDepth: { type: "number", minimum: 0 },
    hemAllowance: { type: "number", minimum: 0 },
  },
  required: ["finishedLength", "cuffDepth", "hemAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cutLength: { type: "number" }, allowance: { type: "number" } },
  required: ["cutLength", "allowance"],
} as const;
/** Budget two cuff depths plus a separate hem allowance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { finishedLength, cuffDepth, hemAllowance } = request;
  const compute = (): Output => {
    H.domain(finishedLength >= 0 && cuffDepth >= 0 && hemAllowance >= 0);
    return {
      cutLength: finishedLength + 2 * cuffDepth + hemAllowance,
      allowance: 2 * cuffDepth + hemAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { finishedLength: 100, cuffDepth: 4, hemAllowance: 2 },
  output: { cutLength: 110, allowance: 10 },
} satisfies ToolExample<Input, Output>;
export const trouserHemCuffTurnupBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/trouser-hem-cuff-turnup-budget",
    title: "Trouser Hem Cuff Turnup Budget Tool",
    description: "Budget two cuff depths plus a separate hem allowance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finishedLength: { type: "number", minimum: 0 },
        cuffDepth: { type: "number", minimum: 0 },
        hemAllowance: { type: "number", minimum: 0 },
      },
      required: ["finishedLength", "cuffDepth", "hemAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cutLength: { type: "number" },
        allowance: { type: "number" },
      },
      required: ["cutLength", "allowance"],
    },
    ports: {
      inputs: [
        {
          id: "finishedLength",
          label: "Finished Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cuffDepth",
          label: "Cuff Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hemAllowance",
          label: "Hem Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cutLength", label: "Cut Length", valueType: { type: "number" } },
        { id: "allowance", label: "Allowance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = trouserHemCuffTurnupBudgetTool.execute;
export default trouserHemCuffTurnupBudgetTool;
