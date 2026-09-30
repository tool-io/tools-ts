import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pieces: number;
  readonly postagePerPiece: number;
  readonly returned: number;
  readonly creditPerReturn: number;
};
export type Output = {
  readonly grossPostage: number;
  readonly credit: number;
  readonly netPostage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pieces: { type: "integer", minimum: 0 },
    postagePerPiece: { type: "number", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    creditPerReturn: { type: "number", minimum: 0 },
  },
  required: ["pieces", "postagePerPiece", "returned", "creditPerReturn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPostage: { type: "number" },
    credit: { type: "number" },
    netPostage: { type: "number" },
  },
  required: ["grossPostage", "credit", "netPostage"],
} as const;
/** Calculate direct mail postage return credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pieces, postagePerPiece, returned, creditPerReturn } = request;
  const compute = (): Output => {
    H.integer(pieces, 0);
    H.integer(returned, 0, pieces);
    H.domain(postagePerPiece >= 0 && creditPerReturn >= 0);
    return {
      grossPostage: pieces * postagePerPiece,
      credit: returned * creditPerReturn,
      netPostage: pieces * postagePerPiece - returned * creditPerReturn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pieces: 1000,
    postagePerPiece: 0.5,
    returned: 100,
    creditPerReturn: 0.2,
  },
  output: { grossPostage: 500, credit: 20, netPostage: 480 },
} satisfies ToolExample<Input, Output>;
export const directMailPostageReturnCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/direct-mail-postage-return-credit",
    title: "Direct Mail Postage Return Credit Tool",
    description:
      "Calculate direct mail postage return credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pieces: { type: "integer", minimum: 0 },
        postagePerPiece: { type: "number", minimum: 0 },
        returned: { type: "integer", minimum: 0 },
        creditPerReturn: { type: "number", minimum: 0 },
      },
      required: ["pieces", "postagePerPiece", "returned", "creditPerReturn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossPostage: { type: "number" },
        credit: { type: "number" },
        netPostage: { type: "number" },
      },
      required: ["grossPostage", "credit", "netPostage"],
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
          id: "postagePerPiece",
          label: "Postage Per Piece",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "creditPerReturn",
          label: "Credit Per Return",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossPostage",
          label: "Gross Postage",
          valueType: { type: "number" },
        },
        { id: "credit", label: "Credit", valueType: { type: "number" } },
        {
          id: "netPostage",
          label: "Net Postage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = directMailPostageReturnCreditTool.execute;
export default directMailPostageReturnCreditTool;
