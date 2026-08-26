import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FractureJoinPieceReconcilerInput = {
  readonly fragmentCount: number;
  readonly matchedJoinCount: number;
};

export type FractureJoinPieceReconcilerOutput = {
  readonly unjoinedFragmentCount: number;
  readonly joinCompletionPercent: number;
};

export const calculateFractureJoinPieceReconciler = (
  input: FractureJoinPieceReconcilerInput,
): FractureJoinPieceReconcilerOutput => {
  if (!(Number.isInteger(input.fragmentCount) && input.fragmentCount >= 1))
    return simpleError(
      "fragmentCount",
      "Fragment count must be an integer of at least one.",
      "invalid_count",
    );
  if (!(
    Number.isInteger(input.matchedJoinCount) &&
    input.matchedJoinCount >= 0 &&
    input.matchedJoinCount <= input.fragmentCount
  ))
    return simpleError(
      "matchedJoinCount",
      "Matched join count must be an integer between zero and the fragment count.",
      "invalid_count",
    );
  return {
    unjoinedFragmentCount: input.fragmentCount - input.matchedJoinCount,
    joinCompletionPercent: (input.matchedJoinCount / input.fragmentCount) * 100,
  };
};

export const fractureJoinPieceReconcilerExample = {
  input: { fragmentCount: 12, matchedJoinCount: 9 },
  output: { unjoinedFragmentCount: 3, joinCompletionPercent: 75 },
} satisfies ToolExample<
  FractureJoinPieceReconcilerInput,
  FractureJoinPieceReconcilerOutput
>;

export const fractureJoinPieceReconcilerTool = createSimpleTool({
  id: "epigraphy/fracture-join-piece-reconciler",
  title: "Fracture Join Match Piece Count Reconciler",
  description:
    "Reconcile a fragment assembly by reporting how many pieces remain unjoined and what percentage of the fragments have been matched into joins.",
  inputs: [
    {
      description: "Total fragments in the assemblage.",
      id: "fragmentCount",
      kind: "integer",
      label: "Fragments",
      minimum: 1,
    },
    {
      description: "Fragments successfully placed in matched joins.",
      id: "matchedJoinCount",
      kind: "integer",
      label: "Matched joins",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Fragments not yet joined.",
      id: "unjoinedFragmentCount",
      kind: "integer",
      label: "Unjoined",
    },
    {
      description: "Share of fragments joined, in percent.",
      id: "joinCompletionPercent",
      kind: "number",
      label: "Completion",
    },
  ],
  calculate: (input) =>
    calculateFractureJoinPieceReconciler(
      input as unknown as FractureJoinPieceReconcilerInput,
    ),
});

export const runFractureJoinPieceReconciler =
  fractureJoinPieceReconcilerTool.execute;
export default fractureJoinPieceReconcilerTool;
