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
  aligned,
  ordered,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly referenceLiquidDensitiesGramsPerCm3: readonly number[];
  readonly referenceBeadBuoyancyCodes: readonly number[];
}>;
export type Output = Readonly<{
  readonly estimatedDensityLowerGramsPerCm3: number;
  readonly estimatedDensityUpperGramsPerCm3: number;
  readonly neutralDensityObserved: boolean;
}>;
const inputFields = [
  {
    id: "referenceLiquidDensitiesGramsPerCm3",
    label: "Reference liquid densities grams per cm3",
    kind: "numberList",
  },
  {
    id: "referenceBeadBuoyancyCodes",
    label: "Reference bead buoyancy codes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.referenceLiquidDensitiesGramsPerCm3.forEach((v) =>
    positive(v, "referenceLiquidDensitiesGramsPerCm3"),
  );
  aligned(
    input.referenceLiquidDensitiesGramsPerCm3,
    input.referenceBeadBuoyancyCodes,
    "referenceLiquidDensitiesGramsPerCm3",
  );
  ordered(input.referenceLiquidDensitiesGramsPerCm3, "liquids");
  if (
    input.referenceBeadBuoyancyCodes.some(
      (v) => v !== -1 && v !== 0 && v !== 1,
    ) ||
    input.referenceBeadBuoyancyCodes.some(
      (v, i) => i > 0 && v < input.referenceBeadBuoyancyCodes[i - 1],
    )
  )
    simpleError(
      "buoyancy",
      "Consistent sink/neutral/float codes -1/0/+1 on increasing liquid densities required.",
    );
  const neutral = input.referenceBeadBuoyancyCodes.flatMap((v, i) =>
    v === 0 ? [input.referenceLiquidDensitiesGramsPerCm3[i]] : [],
  );
  if (neutral.length > 1)
    simpleError(
      "neutral",
      "Multiple distinct neutral densities are inconsistent.",
    );
  if (neutral.length)
    return {
      estimatedDensityLowerGramsPerCm3: neutral[0],
      estimatedDensityUpperGramsPerCm3: neutral[0],
      neutralDensityObserved: true,
    };
  const sink = input.referenceLiquidDensitiesGramsPerCm3.filter(
      (_, i) => input.referenceBeadBuoyancyCodes[i] === -1,
    ),
    float = input.referenceLiquidDensitiesGramsPerCm3.filter(
      (_, i) => input.referenceBeadBuoyancyCodes[i] === 1,
    );
  if (!sink.length || !float.length)
    simpleError(
      "bracket",
      "Observed density bracket required; no unbounded extrapolation.",
    );
  return {
    estimatedDensityLowerGramsPerCm3: maximum(sink),
    estimatedDensityUpperGramsPerCm3: minimum(float),
    neutralDensityObserved: false,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceLiquidDensitiesGramsPerCm3: [2, 3, 4],
  referenceBeadBuoyancyCodes: [-1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  estimatedDensityLowerGramsPerCm3: 3,
  estimatedDensityUpperGramsPerCm3: 3,
  neutralDensityObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/heavy-liquid-sg-estimate",
  title: "Heavy Liquid SG Estimate",
  description:
    "Bracket specimen density from caller calibrated liquid sink/neutral/float observations, preserving unresolved intervals rather than naming a material; no heavy-liquid preparation, handling or care guidance.",
  inputs: inputFields,
  outputs: [
    {
      id: "estimatedDensityLowerGramsPerCm3",
      label: "Estimated density lower grams per cm3",
      kind: "number",
    },
    {
      id: "estimatedDensityUpperGramsPerCm3",
      label: "Estimated density upper grams per cm3",
      kind: "number",
    },
    {
      id: "neutralDensityObserved",
      label: "Neutral density observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceLiquidDensitiesGramsPerCm3:
        value.referenceLiquidDensitiesGramsPerCm3 as readonly number[],
      referenceBeadBuoyancyCodes:
        value.referenceBeadBuoyancyCodes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
