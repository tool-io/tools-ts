import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly c: number;
  readonly firstRoot: number;
  readonly secondRoot: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number" },
    c: { type: "number" },
    firstRoot: { type: "number" },
    secondRoot: { type: "number" },
  },
  required: ["a", "c", "firstRoot", "secondRoot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Compare a supplied pair of roots with the quadratic Vieta product c/a. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { a, c, firstRoot, secondRoot } = request;
  const compute = (): Output => {
    H.domain(a !== 0);
    return { residual: firstRoot * secondRoot - c / a };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { a: 2, c: 12, firstRoot: 2, secondRoot: 4 },
  output: { residual: 2 },
} satisfies ToolExample<Input, Output>;
export const vietaRootProductResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/vieta-root-product-residual",
    title: "Vieta Root Product Residual Tool",
    description:
      "Compare a supplied pair of roots with the quadratic Vieta product c/a.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "number" },
        c: { type: "number" },
        firstRoot: { type: "number" },
        secondRoot: { type: "number" },
      },
      required: ["a", "c", "firstRoot", "secondRoot"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" } },
      required: ["residual"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "c", label: "C", required: true, valueType: { type: "number" } },
        {
          id: "firstRoot",
          label: "First Root",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRoot",
          label: "Second Root",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = vietaRootProductResidualTool.execute;
export default vietaRootProductResidualTool;
