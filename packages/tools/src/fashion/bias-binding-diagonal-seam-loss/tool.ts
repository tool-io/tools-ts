import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pieces: number;
  readonly pieceLength: number;
  readonly stripWidth: number;
};
export type Output = {
  readonly grossLength: number;
  readonly seamLoss: number;
  readonly netLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pieces: { type: "integer", minimum: 1 },
    pieceLength: { type: "number" },
    stripWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pieces", "pieceLength", "stripWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossLength: { type: "number" },
    seamLoss: { type: "number" },
    netLength: { type: "number" },
  },
  required: ["grossLength", "seamLoss", "netLength"],
} as const;
/** Use square-ended strips joined at 45 degrees; each diagonal join consumes one strip width of axial length, excluding seam allowance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pieces, pieceLength, stripWidth } = request;
  const compute = (): Output => {
    H.integer(pieces, 1);
    H.domain(pieceLength >= stripWidth && stripWidth > 0);
    return {
      grossLength: pieces * pieceLength,
      seamLoss: Math.max(0, pieces - 1) * stripWidth,
      netLength: pieces * pieceLength - Math.max(0, pieces - 1) * stripWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pieces: 4, pieceLength: 100, stripWidth: 5 },
  output: { grossLength: 400, seamLoss: 15, netLength: 385 },
} satisfies ToolExample<Input, Output>;
export const biasBindingDiagonalSeamLossTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/bias-binding-diagonal-seam-loss",
    title: "Bias Binding Diagonal Seam Loss Tool",
    description:
      "Use square-ended strips joined at 45 degrees; each diagonal join consumes one strip width of axial length, excluding seam allowance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pieces: { type: "integer", minimum: 1 },
        pieceLength: { type: "number" },
        stripWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pieces", "pieceLength", "stripWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossLength: { type: "number" },
        seamLoss: { type: "number" },
        netLength: { type: "number" },
      },
      required: ["grossLength", "seamLoss", "netLength"],
    },
    ports: {
      inputs: [
        {
          id: "pieces",
          label: "Pieces",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pieceLength",
          label: "Piece Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stripWidth",
          label: "Strip Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossLength",
          label: "Gross Length",
          valueType: { type: "number" },
        },
        { id: "seamLoss", label: "Seam Loss", valueType: { type: "number" } },
        { id: "netLength", label: "Net Length", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biasBindingDiagonalSeamLossTool.execute;
export default biasBindingDiagonalSeamLossTool;
