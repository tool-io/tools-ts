import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly p: string;
  readonly previousP: string;
  readonly q: string;
  readonly previousQ: string;
};
export type Output = {
  readonly determinant: string;
  readonly unimodular: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    p: { type: "string", maxLength: 8192 },
    previousP: { type: "string", maxLength: 8192 },
    q: { type: "string", maxLength: 8192 },
    previousQ: { type: "string", maxLength: 8192 },
  },
  required: ["p", "previousP", "q", "previousQ"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    determinant: { type: "string", maxLength: 8192 },
    unimodular: { type: "boolean" },
  },
  required: ["determinant", "unimodular"],
} as const;
/** Calculate continued fraction convergent determinant from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { p, previousP, q, previousQ } = request;
  const compute = (): Output => {
    const a = H.decimal(p),
      b = H.decimal(previousP),
      c = H.decimal(q),
      d = H.decimal(previousQ),
      det = a * d - b * c;
    return { determinant: String(det), unimodular: det === 1n || det === -1n };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { p: "7", previousP: "3", q: "5", previousQ: "2" },
  output: { determinant: "-1", unimodular: true },
} satisfies ToolExample<Input, Output>;
export const continuedFractionConvergentDeterminantTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "number/continued-fraction-convergent-determinant",
      title: "Continued Fraction Convergent Determinant Tool",
      description:
        "Calculate continued fraction convergent determinant from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          p: { type: "string", maxLength: 8192 },
          previousP: { type: "string", maxLength: 8192 },
          q: { type: "string", maxLength: 8192 },
          previousQ: { type: "string", maxLength: 8192 },
        },
        required: ["p", "previousP", "q", "previousQ"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          determinant: { type: "string", maxLength: 8192 },
          unimodular: { type: "boolean" },
        },
        required: ["determinant", "unimodular"],
      },
      ports: {
        inputs: [
          {
            id: "p",
            label: "P",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "previousP",
            label: "Previous P",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "q",
            label: "Q",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "previousQ",
            label: "Previous Q",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "determinant",
            label: "Determinant",
            valueType: { type: "string" },
          },
          {
            id: "unimodular",
            label: "Unimodular",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = continuedFractionConvergentDeterminantTool.execute;
export default continuedFractionConvergentDeterminantTool;
