import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly orderedBeadDiametersMm: readonly number[];
  readonly interBeadGapMm: number;
  readonly claspOccupiedLengthMm: number;
  readonly targetStrandLengthMm: number;
}>;
export type Output = Readonly<{
  readonly maximumCompletePrefixBeadCount: number;
  readonly occupiedStrandLengthMm: number;
  readonly unfilledTargetLengthMm: number;
}>;
const inputFields = [
  {
    id: "orderedBeadDiametersMm",
    label: "Ordered bead diameters mm",
    kind: "numberList",
  },
  { id: "interBeadGapMm", label: "Inter bead gap mm", kind: "number" },
  {
    id: "claspOccupiedLengthMm",
    label: "Clasp occupied length mm",
    kind: "number",
  },
  {
    id: "targetStrandLengthMm",
    label: "Target strand length mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.orderedBeadDiametersMm.forEach((v) =>
    positive(v, "orderedBeadDiametersMm"),
  );
  nonnegative(input.interBeadGapMm, "interBeadGapMm");
  nonnegative(input.claspOccupiedLengthMm, "claspOccupiedLengthMm");
  nonnegative(input.targetStrandLengthMm, "targetStrandLengthMm");
  if (input.claspOccupiedLengthMm > input.targetStrandLengthMm)
    simpleError("clasp", "Clasp exceeds target strand length.");
  let used = input.claspOccupiedLengthMm,
    n = 0;
  for (const d of input.orderedBeadDiametersMm) {
    const next = d + (n ? input.interBeadGapMm : 0);
    if (next > input.targetStrandLengthMm - used) break;
    used += next;
    n++;
  }
  return {
    maximumCompletePrefixBeadCount: n,
    occupiedStrandLengthMm: used,
    unfilledTargetLengthMm: input.targetStrandLengthMm - used,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orderedBeadDiametersMm: [10, 20, 10],
  interBeadGapMm: 1,
  claspOccupiedLengthMm: 10,
  targetStrandLengthMm: 42,
} satisfies Input;
export const exampleOutput = {
  maximumCompletePrefixBeadCount: 2,
  occupiedStrandLengthMm: 41,
  unfilledTargetLengthMm: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/strand-bead-count",
  title: "Strand Length Bead Count",
  description:
    "Fit a complete prefix of explicitly ordered variable-diameter beads and gaps around caller clasp length, retaining remainder; not a fixed bead-size lookup or permission to reorder a graduated strand.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumCompletePrefixBeadCount",
      label: "Maximum complete prefix bead count",
      kind: "number",
    },
    {
      id: "occupiedStrandLengthMm",
      label: "Occupied strand length mm",
      kind: "number",
    },
    {
      id: "unfilledTargetLengthMm",
      label: "Unfilled target length mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      orderedBeadDiametersMm: value.orderedBeadDiametersMm as readonly number[],
      interBeadGapMm: value.interBeadGapMm as number,
      claspOccupiedLengthMm: value.claspOccupiedLengthMm as number,
      targetStrandLengthMm: value.targetStrandLengthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
