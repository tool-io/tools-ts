import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly jacobian: readonly number[] };
export type Output = {
  readonly determinant: number;
  readonly parity: number;
  readonly critical: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jacobian: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["jacobian"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    determinant: { type: "number" },
    parity: { type: "integer" },
    critical: { type: "boolean" },
  },
  required: ["determinant", "parity", "critical"],
} as const;
/** Parity of a supplied row-major 2x2 lens mapping Jacobian; no lens model is fitted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jacobian } = request;
  const compute = (): Output => {
    H.domain(jacobian.length === 4);
    return {
      determinant: jacobian[0] * jacobian[3] - jacobian[1] * jacobian[2],
      parity: Math.sign(jacobian[0] * jacobian[3] - jacobian[1] * jacobian[2]),
      critical: jacobian[0] * jacobian[3] === jacobian[1] * jacobian[2],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { jacobian: [2, 0, 0, -1] },
  output: { determinant: -2, parity: -1, critical: false },
} satisfies ToolExample<Input, Output>;
export const lensingParityDeterminantSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/lensing-parity-determinant-sign",
    title: "Lensing Parity Determinant Sign Tool",
    description:
      "Parity of a supplied row-major 2x2 lens mapping Jacobian; no lens model is fitted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jacobian: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["jacobian"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        determinant: { type: "number" },
        parity: { type: "integer" },
        critical: { type: "boolean" },
      },
      required: ["determinant", "parity", "critical"],
    },
    ports: {
      inputs: [
        {
          id: "jacobian",
          label: "Jacobian",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "determinant",
          label: "Determinant",
          valueType: { type: "number" },
        },
        { id: "parity", label: "Parity", valueType: { type: "integer" } },
        { id: "critical", label: "Critical", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = lensingParityDeterminantSignTool.execute;
export default lensingParityDeterminantSignTool;
