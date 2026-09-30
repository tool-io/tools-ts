import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredAmount: number;
  readonly dilutionFactor: number;
  readonly referenceAmount: number;
};
export type Output = {
  readonly correctedAmount: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredAmount: { type: "number", minimum: 0 },
    dilutionFactor: { type: "number", minimum: 1 },
    referenceAmount: { type: "number", minimum: 0 },
  },
  required: ["measuredAmount", "dilutionFactor", "referenceAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedAmount: { type: "number" },
    residual: { type: "number" },
  },
  required: ["correctedAmount", "residual"],
} as const;
/** Calculate plate dilution mass reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredAmount, dilutionFactor, referenceAmount } = request;
  const compute = (): Output => {
    H.domain(
      measuredAmount >= 0 && referenceAmount >= 0 && dilutionFactor >= 1,
    );
    return {
      correctedAmount: measuredAmount * dilutionFactor,
      residual: measuredAmount * dilutionFactor - referenceAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredAmount: 2, dilutionFactor: 5, referenceAmount: 8 },
  output: { correctedAmount: 10, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const plateDilutionMassReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/plate-dilution-mass-reference-gap",
    title: "Plate Dilution Mass Reference Gap Tool",
    description:
      "Calculate plate dilution mass reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredAmount: { type: "number", minimum: 0 },
        dilutionFactor: { type: "number", minimum: 1 },
        referenceAmount: { type: "number", minimum: 0 },
      },
      required: ["measuredAmount", "dilutionFactor", "referenceAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedAmount: { type: "number" },
        residual: { type: "number" },
      },
      required: ["correctedAmount", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "measuredAmount",
          label: "Measured Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dilutionFactor",
          label: "Dilution Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAmount",
          label: "Reference Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedAmount",
          label: "Corrected Amount",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = plateDilutionMassReferenceGapTool.execute;
export default plateDilutionMassReferenceGapTool;
