import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cutWidth: number;
  readonly seamAllowance: number;
  readonly firstFold: number;
  readonly secondFold: number;
};
export type Output = { readonly visibleWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cutWidth: { type: "number", minimum: 0 },
    seamAllowance: { type: "number", minimum: 0 },
    firstFold: { type: "number", minimum: 0 },
    secondFold: { type: "number", minimum: 0 },
  },
  required: ["cutWidth", "seamAllowance", "firstFold", "secondFold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { visibleWidth: { type: "number" } },
  required: ["visibleWidth"],
} as const;
/** Calculate placket fold back width budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cutWidth, seamAllowance, firstFold, secondFold } = request;
  const compute = (): Output => {
    H.domain(
      cutWidth >= 0 && seamAllowance >= 0 && firstFold >= 0 && secondFold >= 0,
    );
    return {
      visibleWidth: cutWidth - 2 * seamAllowance - firstFold - secondFold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cutWidth: 10, seamAllowance: 1, firstFold: 2, secondFold: 2 },
  output: { visibleWidth: 4 },
} satisfies ToolExample<Input, Output>;
export const placketFoldBackWidthBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/placket-fold-back-width-budget",
    title: "Placket Fold Back Width Budget Tool",
    description:
      "Calculate placket fold back width budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cutWidth: { type: "number", minimum: 0 },
        seamAllowance: { type: "number", minimum: 0 },
        firstFold: { type: "number", minimum: 0 },
        secondFold: { type: "number", minimum: 0 },
      },
      required: ["cutWidth", "seamAllowance", "firstFold", "secondFold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { visibleWidth: { type: "number" } },
      required: ["visibleWidth"],
    },
    ports: {
      inputs: [
        {
          id: "cutWidth",
          label: "Cut Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seamAllowance",
          label: "Seam Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstFold",
          label: "First Fold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondFold",
          label: "Second Fold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "visibleWidth",
          label: "Visible Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = placketFoldBackWidthBudgetTool.execute;
export default placketFoldBackWidthBudgetTool;
