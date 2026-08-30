import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly floorMassSusceptibilities: readonly number[];
  readonly backgroundMassSusceptibilities: readonly number[];
  readonly instrumentOffset: number;
  readonly callerMinimumEnhancementRatio: number;
}>;
export type Output = Readonly<{
  readonly correctedSusceptibilityDifferences: readonly number[];
  readonly floorBackgroundEnhancementRatios: readonly number[];
  readonly aboveCallerEnhancementFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "floorMassSusceptibilities",
    label: "Floor mass susceptibilities",
    kind: "numberList",
  },
  {
    id: "backgroundMassSusceptibilities",
    label: "Background mass susceptibilities",
    kind: "numberList",
  },
  { id: "instrumentOffset", label: "Instrument offset", kind: "number" },
  {
    id: "callerMinimumEnhancementRatio",
    label: "Caller minimum enhancement ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMinimumEnhancementRatio,
    "callerMinimumEnhancementRatio",
  );
  aligned(
    input.floorMassSusceptibilities,
    input.backgroundMassSusceptibilities,
    "floorMassSusceptibilities",
  );
  const correctedSusceptibilityDifferences =
      input.floorMassSusceptibilities.map(
        (v, i) => v - input.backgroundMassSusceptibilities[i],
      ),
    floorBackgroundEnhancementRatios = input.floorMassSusceptibilities.map(
      (v, i) =>
        (v - input.instrumentOffset) /
        positive(
          input.backgroundMassSusceptibilities[i] - input.instrumentOffset,
          "backgroundMassSusceptibilities",
        ),
    );
  return {
    correctedSusceptibilityDifferences,
    floorBackgroundEnhancementRatios,
    aboveCallerEnhancementFlags: floorBackgroundEnhancementRatios.map((v) =>
      v >= input.callerMinimumEnhancementRatio ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  floorMassSusceptibilities: [10, 5],
  backgroundMassSusceptibilities: [8, 8],
  instrumentOffset: 1,
  callerMinimumEnhancementRatio: 1.2,
} satisfies Input;
export const exampleOutput = {
  correctedSusceptibilityDifferences: [2, -3],
  floorBackgroundEnhancementRatios: [1.2857142857142858, 0.5714285714285714],
  aboveCallerEnhancementFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/magnetic-susceptibility-floor-anomaly",
  title: "Magnetic Susceptibility Floor Anomaly Tool",
  description:
    "Compare paired same-basis floor/background susceptibility with instrument offset and caller enhancement policy; signed differences remain and enhancement is not proof of burning or a buried floor.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedSusceptibilityDifferences",
      label: "Corrected susceptibility differences",
      kind: "numberList",
    },
    {
      id: "floorBackgroundEnhancementRatios",
      label: "Floor background enhancement ratios",
      kind: "numberList",
    },
    {
      id: "aboveCallerEnhancementFlags",
      label: "Above caller enhancement flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      floorMassSusceptibilities:
        value.floorMassSusceptibilities as readonly number[],
      backgroundMassSusceptibilities:
        value.backgroundMassSusceptibilities as readonly number[],
      instrumentOffset: value.instrumentOffset as number,
      callerMinimumEnhancementRatio:
        value.callerMinimumEnhancementRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
