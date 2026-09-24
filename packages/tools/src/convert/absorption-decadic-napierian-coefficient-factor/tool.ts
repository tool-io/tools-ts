import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly decadicCoefficient: number };
export type Output = { readonly napierianCoefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { decadicCoefficient: { type: "number", minimum: 0 } },
  required: ["decadicCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { napierianCoefficient: { type: "number" } },
  required: ["napierianCoefficient"],
} as const;
/** Calculate absorption decadic napierian coefficient factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { decadicCoefficient } = request;
  const compute = (): Output => {
    H.domain(decadicCoefficient >= 0);
    return { napierianCoefficient: decadicCoefficient * Math.LN10 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { decadicCoefficient: 2 },
  output: { napierianCoefficient: 4.605170185988092 },
} satisfies ToolExample<Input, Output>;
export const absorptionDecadicNapierianCoefficientFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/absorption-decadic-napierian-coefficient-factor",
      title: "Absorption Decadic Napierian Coefficient Factor Tool",
      description:
        "Calculate absorption decadic napierian coefficient factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { decadicCoefficient: { type: "number", minimum: 0 } },
        required: ["decadicCoefficient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { napierianCoefficient: { type: "number" } },
        required: ["napierianCoefficient"],
      },
      ports: {
        inputs: [
          {
            id: "decadicCoefficient",
            label: "Decadic Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "napierianCoefficient",
            label: "Napierian Coefficient",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = absorptionDecadicNapierianCoefficientFactorTool.execute;
export default absorptionDecadicNapierianCoefficientFactorTool;
