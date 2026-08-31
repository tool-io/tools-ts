import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape, bounded } from "../shared.js";
export type Input = Readonly<{
  readonly observedDominoTiles: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly observedTileCount: number;
  readonly totalObservedPips: number;
  readonly missingDoubleSixTileCount: number;
  readonly completeDoubleSixSet: boolean;
}>;
const inputFields = [
  { id: "observedDominoTiles", label: "Observed domino tiles", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (shape(input.observedDominoTiles, "tiles") !== 2)
    simpleError("tiles", "Two ends per tile required.");
  const keys = input.observedDominoTiles.map((r) => {
    r.forEach((v) => bounded(v, "pip", 0, 6));
    return [...r].sort((a, b) => a - b).join(",");
  });
  if (new Set(keys).size !== keys.length)
    simpleError("tiles", "No duplicated unordered double-six tiles allowed.");
  return {
    observedTileCount: keys.length,
    totalObservedPips: input.observedDominoTiles
      .flat()
      .reduce((a, b) => a + b, 0),
    missingDoubleSixTileCount: 28 - keys.length,
    completeDoubleSixSet: keys.length === 28,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDominoTiles: [
    [0, 0],
    [1, 2],
    [6, 6],
  ],
} satisfies Input;
export const exampleOutput = {
  observedTileCount: 3,
  totalObservedPips: 15,
  missingDoubleSixTileCount: 25,
  completeDoubleSixSet: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/dominoes-double-six-total-pips",
  title: "Double-Six Dominoes Total Pips",
  description:
    "Audit actual unordered double-six domino inventory for duplicates, total pips and missing tiles rather than a fixed reference total.",
  inputs: inputFields,
  outputs: [
    { id: "observedTileCount", label: "Observed tile count", kind: "number" },
    { id: "totalObservedPips", label: "Total observed pips", kind: "number" },
    {
      id: "missingDoubleSixTileCount",
      label: "Missing double six tile count",
      kind: "number",
    },
    {
      id: "completeDoubleSixSet",
      label: "Complete double six set",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDominoTiles:
        value.observedDominoTiles as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
