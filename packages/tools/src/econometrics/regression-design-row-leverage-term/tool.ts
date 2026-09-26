import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly designRow: readonly number[];
  readonly inverseGram: readonly (readonly number[])[];
};
export type Output = { readonly leverage: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    designRow: { type: "array", maxItems: 256, items: { type: "number" } },
    inverseGram: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
  },
  required: ["designRow", "inverseGram"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leverage: { type: "number" } },
  required: ["leverage"],
} as const;
/** Compute supplied xᵀ(XᵀX)⁻¹x; the caller supplies a valid inverse Gram matrix and model row. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { designRow, inverseGram } = request;
  const compute = (): Output => {
    H.domain(
      inverseGram.length === designRow.length &&
        inverseGram.every((row) => row.length === designRow.length),
    );
    return {
      leverage: designRow.reduce(
        (s, x, i) => s + x * H.dot(inverseGram[i], designRow),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    designRow: [1, 2],
    inverseGram: [
      [0.2, 0],
      [0, 0.05],
    ],
  },
  output: { leverage: 0.4 },
} satisfies ToolExample<Input, Output>;
export const regressionDesignRowLeverageTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/regression-design-row-leverage-term",
    title: "Regression Design Row Leverage Term Tool",
    description:
      "Compute supplied xᵀ(XᵀX)⁻¹x; the caller supplies a valid inverse Gram matrix and model row.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        designRow: { type: "array", maxItems: 256, items: { type: "number" } },
        inverseGram: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
      },
      required: ["designRow", "inverseGram"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { leverage: { type: "number" } },
      required: ["leverage"],
    },
    ports: {
      inputs: [
        {
          id: "designRow",
          label: "Design Row",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "inverseGram",
          label: "Inverse Gram",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
      ],
      outputs: [
        { id: "leverage", label: "Leverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = regressionDesignRowLeverageTermTool.execute;
export default regressionDesignRowLeverageTermTool;
