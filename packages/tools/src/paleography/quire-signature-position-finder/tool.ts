import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuireSignaturePositionFinderInput = {
  readonly quireNumber: number;
  readonly leafInQuire: number;
  readonly leavesPerQuire?: number;
};

export type QuireSignaturePositionFinderOutput = {
  readonly partnerLeafNumber: number;
  readonly quireHalf: "first" | "second";
  readonly bifoliumIndexFromOutside: number;
  readonly sequenceLeafNumber: number;
};

export const calculateQuireSignaturePositionFinder = (
  input: QuireSignaturePositionFinderInput,
): QuireSignaturePositionFinderOutput => {
  const leavesPerQuire = input.leavesPerQuire ?? 8;
  if (
    !Number.isSafeInteger(leavesPerQuire) ||
    leavesPerQuire < 2 ||
    leavesPerQuire % 2 !== 0
  )
    return simpleError(
      "leavesPerQuire",
      "Quires contain an even number of leaves of at least two.",
      "invalid_quire",
    );
  if (!(Number.isSafeInteger(input.quireNumber) && input.quireNumber >= 1))
    return simpleError(
      "quireNumber",
      "Quire number must be a positive integer.",
      "invalid_quire",
    );
  if (
    !Number.isSafeInteger(input.leafInQuire) ||
    input.leafInQuire < 1 ||
    input.leafInQuire > leavesPerQuire
  )
    return simpleError(
      "leafInQuire",
      `Leaf position must lie between 1 and ${leavesPerQuire}.`,
      "invalid_quire",
    );
  const partnerLeafNumber = leavesPerQuire + 1 - input.leafInQuire;
  const sequenceLeafNumber =
    (input.quireNumber - 1) * leavesPerQuire + input.leafInQuire;
  if (!Number.isSafeInteger(sequenceLeafNumber))
    return simpleError(
      "quireNumber",
      "The running leaf number exceeds the safe integer range.",
      "numeric_overflow",
    );
  return {
    partnerLeafNumber,
    quireHalf: input.leafInQuire <= leavesPerQuire / 2 ? "first" : "second",
    bifoliumIndexFromOutside: Math.min(input.leafInQuire, partnerLeafNumber),
    sequenceLeafNumber,
  };
};

export const quireSignaturePositionFinderExample = {
  input: { quireNumber: 3, leafInQuire: 2, leavesPerQuire: 8 },
  output: {
    partnerLeafNumber: 7,
    quireHalf: "first",
    bifoliumIndexFromOutside: 2,
    sequenceLeafNumber: 18,
  },
} satisfies ToolExample<
  QuireSignaturePositionFinderInput,
  QuireSignaturePositionFinderOutput
>;

export const quireSignaturePositionFinderTool = createSimpleTool({
  id: "paleography/quire-signature-position-finder",
  title: "Quire Signature Position Finder",
  description:
    "Locate a leaf inside its quire for signature placement: exact arithmetic gives the conjugate leaf, first or second half of the quire, which bifolium counting from the outermost sheet, and the leaf's running number across the manuscript.",
  inputs: [
    {
      description: "Quire number counting from the start.",
      id: "quireNumber",
      kind: "integer",
      label: "Quire",
      minimum: 1,
    },
    {
      description: "Leaf position within the quire, from 1.",
      id: "leafInQuire",
      kind: "integer",
      label: "Leaf in quire",
      minimum: 1,
    },
    {
      default: 8,
      description: "Even leaf count of a full quire.",
      id: "leavesPerQuire",
      kind: "integer",
      label: "Leaves per quire",
      minimum: 2,
    },
  ],
  outputs: [
    {
      description: "Conjugate leaf on the same bifolium.",
      id: "partnerLeafNumber",
      kind: "integer",
      label: "Partner leaf",
    },
    {
      description: "First or second half of the quire.",
      id: "quireHalf",
      enum: ["first", "second"],
      kind: "string",
      label: "Quire half",
    },
    {
      description: "Bifolium index counted from the outside (1 = outermost).",
      id: "bifoliumIndexFromOutside",
      kind: "integer",
      label: "Bifolium index",
    },
    {
      description: "Running leaf number through the whole codex.",
      id: "sequenceLeafNumber",
      kind: "integer",
      label: "Sequence number",
    },
  ],
  calculate: (input) =>
    calculateQuireSignaturePositionFinder({
      quireNumber: input.quireNumber as number,
      leafInQuire: input.leafInQuire as number,
      leavesPerQuire: input.leavesPerQuire as number,
    }),
});

export const runQuireSignaturePositionFinder =
  quireSignaturePositionFinderTool.execute;
export default quireSignaturePositionFinderTool;
