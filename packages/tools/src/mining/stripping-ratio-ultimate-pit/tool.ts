import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly nestedPitOreTonnes: readonly number[];
  readonly nestedPitWasteTonnes: readonly number[];
  readonly maximumIncrementalWasteOreRatio: number;
}>;
export type Output = Readonly<{
  readonly cumulativeRatios: readonly number[];
  readonly incrementalRatios: readonly number[];
  readonly acceptableIncrementalShellFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "nestedPitOreTonnes",
    label: "Nested pit ore tonnes",
    kind: "numberList",
  },
  {
    id: "nestedPitWasteTonnes",
    label: "Nested pit waste tonnes",
    kind: "numberList",
  },
  {
    id: "maximumIncrementalWasteOreRatio",
    label: "Maximum incremental waste ore ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.nestedPitWasteTonnes.forEach((v) =>
    nonnegative(v, "nestedPitWasteTonnes"),
  );
  nonnegative(
    input.maximumIncrementalWasteOreRatio,
    "maximumIncrementalWasteOreRatio",
  );
  aligned(
    input.nestedPitOreTonnes,
    input.nestedPitWasteTonnes,
    "nestedPitOreTonnes",
  );
  ordered(input.nestedPitOreTonnes, "nestedPitOreTonnes");
  positive(input.nestedPitOreTonnes[0], "nestedPitOreTonnes");
  if (
    input.nestedPitWasteTonnes.some(
      (v, i) => i > 0 && v < input.nestedPitWasteTonnes[i - 1],
    )
  )
    simpleError("nestedPitWasteTonnes", "Nested waste cannot decrease.");
  const cumulativeRatios = input.nestedPitOreTonnes.map(
      (v, i) => input.nestedPitWasteTonnes[i] / v,
    ),
    incrementalRatios = input.nestedPitOreTonnes.map(
      (v, i) =>
        (input.nestedPitWasteTonnes[i] -
          (i ? input.nestedPitWasteTonnes[i - 1] : 0)) /
        (v - (i ? input.nestedPitOreTonnes[i - 1] : 0)),
    );
  return {
    cumulativeRatios,
    incrementalRatios,
    acceptableIncrementalShellFlags: incrementalRatios.map((v) =>
      v <= input.maximumIncrementalWasteOreRatio ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  nestedPitOreTonnes: [100, 200, 300],
  nestedPitWasteTonnes: [100, 250, 600],
  maximumIncrementalWasteOreRatio: 2,
} satisfies Input;
export const exampleOutput = {
  cumulativeRatios: [1, 1.25, 2],
  incrementalRatios: [1, 1.5, 3.5],
  acceptableIncrementalShellFlags: [1, 1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/stripping-ratio-ultimate-pit",
  title: "Ultimate Pit Stripping Ratio",
  description:
    "Compare cumulative/incremental stripping across nested shells; limits do not solve ultimate-pit optimization or establish slope feasibility.",
  inputs: inputFields,
  outputs: [
    { id: "cumulativeRatios", label: "Cumulative ratios", kind: "numberList" },
    {
      id: "incrementalRatios",
      label: "Incremental ratios",
      kind: "numberList",
    },
    {
      id: "acceptableIncrementalShellFlags",
      label: "Acceptable incremental shell flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      nestedPitOreTonnes: value.nestedPitOreTonnes as readonly number[],
      nestedPitWasteTonnes: value.nestedPitWasteTonnes as readonly number[],
      maximumIncrementalWasteOreRatio:
        value.maximumIncrementalWasteOreRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
