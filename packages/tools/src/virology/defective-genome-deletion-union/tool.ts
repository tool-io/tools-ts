import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly genomeLengthBp: number;
  readonly deletionStartsBp: readonly number[];
  readonly deletionEndsBp: readonly number[];
}>;
export type Output = Readonly<{
  readonly deletedBases: number;
  readonly deletedGenomeFraction: number;
  readonly retainedGenomeBases: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.genomeLengthBp, "genomeLengthBp", 1);
  if (
    input.deletionStartsBp.length !== input.deletionEndsBp.length ||
    input.deletionStartsBp.some(
      (v, i) =>
        !Number.isSafeInteger(v) ||
        v < 0 ||
        !Number.isSafeInteger(input.deletionEndsBp[i]) ||
        input.deletionEndsBp[i] <= v ||
        input.deletionEndsBp[i] > input.genomeLengthBp,
    )
  )
    simpleError(
      "deletionStartsBp",
      "Aligned valid half-open genome deletion intervals required.",
    );
  const intervals = input.deletionStartsBp
    .map((v, i) => [v, input.deletionEndsBp[i]])
    .sort((a, b) => a[0] - b[0]);
  let deletedBases = 0,
    start = -1,
    end = -1;
  for (const [a, b] of intervals) {
    if (a <= end) end = Math.max(end, b);
    else {
      if (start >= 0) deletedBases += end - start;
      start = a;
      end = b;
    }
  }
  if (start >= 0) deletedBases += end - start;
  return {
    deletedBases,
    deletedGenomeFraction: deletedBases / input.genomeLengthBp,
    retainedGenomeBases: input.genomeLengthBp - deletedBases,
  };
};
export const exampleInput = {
  genomeLengthBp: 1000,
  deletionStartsBp: [100, 150],
  deletionEndsBp: [200, 250],
} satisfies Input;
export const exampleOutput = {
  deletedBases: 150,
  deletedGenomeFraction: 0.15,
  retainedGenomeBases: 850,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/defective-genome-deletion-union",
  title: "Defective Genome Deletion Union",
  description:
    "Measure the union of annotated viral genome deletions without double counting overlaps; deletion fraction does not establish interference.",
  inputs: [
    {
      id: "genomeLengthBp",
      label: "Genome length bp",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "deletionStartsBp",
      label: "Deletion starts bp",
      kind: "numberList",
      description:
        "Zero-based half-open coordinate convention; end positions are exclusive.",
    },
    { id: "deletionEndsBp", label: "Deletion ends bp", kind: "numberList" },
  ],
  outputs: [
    { id: "deletedBases", label: "Deleted bases", kind: "number" },
    {
      id: "deletedGenomeFraction",
      label: "Deleted genome fraction",
      kind: "number",
    },
    {
      id: "retainedGenomeBases",
      label: "Retained genome bases",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      genomeLengthBp: value.genomeLengthBp as number,
      deletionStartsBp: value.deletionStartsBp as readonly number[],
      deletionEndsBp: value.deletionEndsBp as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
