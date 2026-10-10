import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly receivedPieces: number;
  readonly cassettePieceCounts: readonly number[];
  readonly retainedPieces: number;
};
export type Output = {
  readonly cassetteTotal: number;
  readonly unaccountedPieces: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    receivedPieces: { type: "integer", minimum: 0 },
    cassettePieceCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    retainedPieces: { type: "integer", minimum: 0 },
  },
  required: ["receivedPieces", "cassettePieceCounts", "retainedPieces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cassetteTotal: { type: "integer" },
    unaccountedPieces: { type: "integer" },
  },
  required: ["cassetteTotal", "unaccountedPieces"],
} as const;
/** Reconcile supplied tissue-piece counts across cassettes and retained material without assigning specimen adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { receivedPieces, cassettePieceCounts, retainedPieces } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(receivedPieces) &&
        receivedPieces >= 0 &&
        receivedPieces <= Number.MAX_SAFE_INTEGER,
      "receivedPieces",
    ),
      receivedPieces);
    (H.domain(
      Number.isSafeInteger(retainedPieces) &&
        retainedPieces >= 0 &&
        retainedPieces <= Number.MAX_SAFE_INTEGER,
      "retainedPieces",
    ),
      retainedPieces);
    cassettePieceCounts.forEach(
      (x) => (
        H.domain(
          Number.isSafeInteger(x) && x >= 0 && x <= Number.MAX_SAFE_INTEGER,
          "cassettePieceCounts",
        ),
        x
      ),
    );
    return (() => {
      const cassetteTotal = cassettePieceCounts.reduce((a, b) => a + b, 0);
      return {
        cassetteTotal,
        unaccountedPieces: receivedPieces - cassetteTotal - retainedPieces,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { receivedPieces: 10, cassettePieceCounts: [3, 4], retainedPieces: 2 },
  output: { cassetteTotal: 7, unaccountedPieces: 1 },
} satisfies ToolExample<Input, Output>;
export const tissueCassettePieceCountBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pathology", "health and medicine"],
      keywords: ["pathology", "health and medicine"],
    },
    id: "pathology/tissue-cassette-piece-count-balance",
    title: "Tissue Cassette Piece Count Balance",
    description:
      "Reconcile supplied tissue-piece counts across cassettes and retained material without assigning specimen adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        receivedPieces: { type: "integer", minimum: 0 },
        cassettePieceCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        retainedPieces: { type: "integer", minimum: 0 },
      },
      required: ["receivedPieces", "cassettePieceCounts", "retainedPieces"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cassetteTotal: { type: "integer" },
        unaccountedPieces: { type: "integer" },
      },
      required: ["cassetteTotal", "unaccountedPieces"],
    },
    ports: {
      inputs: [
        {
          id: "receivedPieces",
          label: "Received Pieces",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cassettePieceCounts",
          label: "Cassette Piece Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "retainedPieces",
          label: "Retained Pieces",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "cassetteTotal",
          label: "Cassette Total",
          valueType: { type: "integer" },
        },
        {
          id: "unaccountedPieces",
          label: "Unaccounted Pieces",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueCassettePieceCountBalanceTool.execute;
export default tissueCassettePieceCountBalanceTool;
