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
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly frameInteriorWidthCm: number;
  readonly frameInteriorHeightCm: number;
  readonly edgeExclusionCm: number;
  readonly usableSides: number;
}>;
export type Output = Readonly<{ readonly usableCombAreaCm2: number }>;
const inputFields = [
  {
    id: "frameInteriorWidthCm",
    label: "Frame interior width cm",
    kind: "number",
  },
  {
    id: "frameInteriorHeightCm",
    label: "Frame interior height cm",
    kind: "number",
  },
  { id: "edgeExclusionCm", label: "Edge exclusion cm", kind: "number" },
  { id: "usableSides", label: "Usable sides", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.frameInteriorWidthCm, "frameInteriorWidthCm");
  positive(input.frameInteriorHeightCm, "frameInteriorHeightCm");
  positive(input.usableSides, "usableSides");
  nonnegative(input.edgeExclusionCm, "edgeExclusionCm");
  count(input.usableSides, "usableSides");
  if (input.usableSides > 2)
    simpleError("usableSides", "A frame has at most two usable faces.");
  const w = positive(
      input.frameInteriorWidthCm - 2 * input.edgeExclusionCm,
      "edgeExclusionCm",
    ),
    h = positive(
      input.frameInteriorHeightCm - 2 * input.edgeExclusionCm,
      "edgeExclusionCm",
    );
  return { usableCombAreaCm2: w * h * input.usableSides };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  frameInteriorWidthCm: 40,
  frameInteriorHeightCm: 20,
  edgeExclusionCm: 1,
  usableSides: 2,
} satisfies Input;
export const exampleOutput = { usableCombAreaCm2: 1368 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/deep-frame-comb-area",
  title: "Deep Frame Comb Area",
  description:
    "Calculate usable deep-frame face area after uniform excluded edges with caller dimensions and one/two sides; repeated medium/shallow aliases are not implemented.",
  inputs: inputFields,
  outputs: [
    { id: "usableCombAreaCm2", label: "Usable comb area cm2", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      frameInteriorWidthCm: value.frameInteriorWidthCm as number,
      frameInteriorHeightCm: value.frameInteriorHeightCm as number,
      edgeExclusionCm: value.edgeExclusionCm as number,
      usableSides: value.usableSides as number,
    }),
});
export const run = tool.execute;
export default tool;
