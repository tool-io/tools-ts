import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction, count } from "../shared.js";
export type Input = Readonly<{
  readonly distributionRatio: number;
  readonly organicAqueousVolumeRatioPerStage: number;
  readonly targetExtractionFraction: number;
}>;
export type Output = Readonly<{
  readonly idealCrosscurrentStages: number;
  readonly achievedExtractionFraction: number;
}>;
const inputFields = [
  { id: "distributionRatio", label: "Distribution ratio", kind: "number" },
  {
    id: "organicAqueousVolumeRatioPerStage",
    label: "Organic aqueous volume ratio per stage",
    kind: "number",
  },
  {
    id: "targetExtractionFraction",
    label: "Target extraction fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.distributionRatio, "distributionRatio");
  positive(
    input.organicAqueousVolumeRatioPerStage,
    "organicAqueousVolumeRatioPerStage",
  );
  fraction(input.targetExtractionFraction, "targetExtractionFraction");
  if (input.targetExtractionFraction === 1)
    simpleError(
      "targetExtractionFraction",
      "Complete extraction requires unbounded stages.",
    );
  const step = positive(
    Math.log1p(
      input.distributionRatio * input.organicAqueousVolumeRatioPerStage,
    ),
    "model",
  );
  let idealCrosscurrentStages = Math.ceil(
    -Math.log1p(-input.targetExtractionFraction) / step,
  );
  if (
    !Number.isSafeInteger(idealCrosscurrentStages) ||
    idealCrosscurrentStages > 100000
  )
    simpleError(
      "targetExtractionFraction",
      "Stage count exceeds planning budget.",
    );
  if (
    idealCrosscurrentStages > 0 &&
    -Math.expm1(-(idealCrosscurrentStages - 1) * step) >=
      input.targetExtractionFraction
  )
    idealCrosscurrentStages--;
  if (
    -Math.expm1(-idealCrosscurrentStages * step) <
    input.targetExtractionFraction
  )
    idealCrosscurrentStages++;
  return {
    idealCrosscurrentStages,
    achievedExtractionFraction: -Math.expm1(-idealCrosscurrentStages * step),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  distributionRatio: 2,
  organicAqueousVolumeRatioPerStage: 0.5,
  targetExtractionFraction: 0.9,
} satisfies Input;
export const exampleOutput = {
  idealCrosscurrentStages: 4,
  achievedExtractionFraction: 0.9375,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/solvent-extraction-stages",
  title: "Solvent Extraction Stages",
  description:
    "Count ideal crosscurrent stages with fresh solute-free organic at each stage and constant D/phase ratio; not countercurrent McCabe–Thiele construction.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealCrosscurrentStages",
      label: "Ideal crosscurrent stages",
      kind: "number",
    },
    {
      id: "achievedExtractionFraction",
      label: "Achieved extraction fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      distributionRatio: value.distributionRatio as number,
      organicAqueousVolumeRatioPerStage:
        value.organicAqueousVolumeRatioPerStage as number,
      targetExtractionFraction: value.targetExtractionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
