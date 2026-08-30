import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly rollLengthsM: readonly number[];
  readonly unusableRollEndLengthsM: readonly number[];
  readonly tiesPerVine: number;
  readonly tapeLengthPerTieM: number;
  readonly handlingWasteFraction: number;
}>;
export type Output = Readonly<{
  readonly usableTapeAfterWasteM: number;
  readonly completeVinesTieBudgetCount: number;
  readonly unusedTapeAfterCompleteVinesM: number;
}>;
const inputFields = [
  { id: "rollLengthsM", label: "Roll lengths m", kind: "numberList" },
  {
    id: "unusableRollEndLengthsM",
    label: "Unusable roll end lengths m",
    kind: "numberList",
  },
  { id: "tiesPerVine", label: "Ties per vine", kind: "integer" },
  { id: "tapeLengthPerTieM", label: "Tape length per tie m", kind: "number" },
  {
    id: "handlingWasteFraction",
    label: "Handling waste fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.tiesPerVine, "tiesPerVine");
  positive(input.tapeLengthPerTieM, "tapeLengthPerTieM");
  input.rollLengthsM.forEach((v) => nonnegative(v, "rollLengthsM"));
  input.unusableRollEndLengthsM.forEach((v) =>
    nonnegative(v, "unusableRollEndLengthsM"),
  );
  fraction(input.handlingWasteFraction, "handlingWasteFraction");
  count(input.tiesPerVine, "tiesPerVine");
  aligned(input.rollLengthsM, input.unusableRollEndLengthsM, "rollLengthsM");
  const usableTapeAfterWasteM =
      input.rollLengthsM.reduce(
        (s, v, i) =>
          s + nonnegative(v - input.unusableRollEndLengthsM[i], "rollEnds"),
        0,
      ) *
      (1 - input.handlingWasteFraction),
    perVine = positive(
      input.tiesPerVine * input.tapeLengthPerTieM,
      "tapePerVine",
    ),
    ratio = usableTapeAfterWasteM / perVine;
  const n = count(
    Math.floor(ratio + 8 * Number.EPSILON * Math.max(1, ratio)),
    "vines",
  );
  return {
    usableTapeAfterWasteM,
    completeVinesTieBudgetCount: n,
    unusedTapeAfterCompleteVinesM: Math.max(
      0,
      usableTapeAfterWasteM - n * perVine,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rollLengthsM: [10, 20],
  unusableRollEndLengthsM: [1, 2],
  tiesPerVine: 3,
  tapeLengthPerTieM: 0.1,
  handlingWasteFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  usableTapeAfterWasteM: 24.3,
  completeVinesTieBudgetCount: 81,
  unusedTapeAfterCompleteVinesM: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/tie-tape-roll-vines-covered",
  title: "Tie Tape Roll Vines Covered",
  description:
    "Budget complete vines from measured tape roll inventory, unusable ends, actual ties/length and handling loss; no universal tying method or dose, remainder retained.",
  inputs: inputFields,
  outputs: [
    {
      id: "usableTapeAfterWasteM",
      label: "Usable tape after waste m",
      kind: "number",
    },
    {
      id: "completeVinesTieBudgetCount",
      label: "Complete vines tie budget count",
      kind: "number",
    },
    {
      id: "unusedTapeAfterCompleteVinesM",
      label: "Unused tape after complete vines m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      rollLengthsM: value.rollLengthsM as readonly number[],
      unusableRollEndLengthsM:
        value.unusableRollEndLengthsM as readonly number[],
      tiesPerVine: value.tiesPerVine as number,
      tapeLengthPerTieM: value.tapeLengthPerTieM as number,
      handlingWasteFraction: value.handlingWasteFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
