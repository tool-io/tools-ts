import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerMotifSignedLateralDisplacements: readonly number[];
  readonly callerMotifDurationsCounts: readonly number[];
  readonly applyRetrograde: boolean;
  readonly applyLateralInversion: boolean;
  readonly callerDurationAugmentationFactor: number;
}>;
export type Output = Readonly<{
  readonly transformedSignedLateralDisplacements: readonly number[];
  readonly transformedDurationsCounts: readonly number[];
  readonly transformedStartCounts: readonly number[];
  readonly transformedTotalCounts: number;
}>;
const inputFields = [
  {
    id: "callerMotifSignedLateralDisplacements",
    label: "Caller motif signed lateral displacements",
    kind: "numberList",
  },
  {
    id: "callerMotifDurationsCounts",
    label: "Caller motif durations counts",
    kind: "numberList",
  },
  { id: "applyRetrograde", label: "Apply retrograde", kind: "boolean" },
  {
    id: "applyLateralInversion",
    label: "Apply lateral inversion",
    kind: "boolean",
  },
  {
    id: "callerDurationAugmentationFactor",
    label: "Caller duration augmentation factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMotifDurationsCounts.forEach((v) =>
    positive(v, "callerMotifDurationsCounts"),
  );
  positive(
    input.callerDurationAugmentationFactor,
    "callerDurationAugmentationFactor",
  );
  aligned(
    input.callerMotifSignedLateralDisplacements,
    input.callerMotifDurationsCounts,
    "callerMotifSignedLateralDisplacements",
  );
  if (!input.callerMotifDurationsCounts.length)
    simpleError("motif", "Actual movement-duration motif required.");
  let moves = [...input.callerMotifSignedLateralDisplacements],
    durations = input.callerMotifDurationsCounts.map(
      (v) => v * input.callerDurationAugmentationFactor,
    );
  if (input.applyRetrograde) {
    moves.reverse();
    durations.reverse();
  }
  if (input.applyLateralInversion) moves = moves.map((v) => -v);
  let end = 0;
  const starts = durations.map((v) => {
    const s = end;
    end += v;
    return s;
  });
  return {
    transformedSignedLateralDisplacements: moves,
    transformedDurationsCounts: durations,
    transformedStartCounts: starts,
    transformedTotalCounts: end,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMotifSignedLateralDisplacements: [1, -2, 3],
  callerMotifDurationsCounts: [1, 2, 1],
  applyRetrograde: true,
  applyLateralInversion: true,
  callerDurationAugmentationFactor: 2,
} satisfies Input;
export const exampleOutput = {
  transformedSignedLateralDisplacements: [-3, 2, -1],
  transformedDurationsCounts: [2, 4, 2],
  transformedStartCounts: [0, 2, 6],
  transformedTotalCounts: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/motif-development-retrograde-augment-inversion-lookup",
  title: "Motif Development Retrograde Augment Inversion Lookup",
  description:
    "Transform actual annotated motif event order, lateral displacement signs and durations independently; event retrograde is not reversing velocity/path endpoints, augmentation not pitch/tempo conversion or invented movement semantics.",
  inputs: inputFields,
  outputs: [
    {
      id: "transformedSignedLateralDisplacements",
      label: "Transformed signed lateral displacements",
      kind: "numberList",
    },
    {
      id: "transformedDurationsCounts",
      label: "Transformed durations counts",
      kind: "numberList",
    },
    {
      id: "transformedStartCounts",
      label: "Transformed start counts",
      kind: "numberList",
    },
    {
      id: "transformedTotalCounts",
      label: "Transformed total counts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMotifSignedLateralDisplacements:
        value.callerMotifSignedLateralDisplacements as readonly number[],
      callerMotifDurationsCounts:
        value.callerMotifDurationsCounts as readonly number[],
      applyRetrograde: value.applyRetrograde as boolean,
      applyLateralInversion: value.applyLateralInversion as boolean,
      callerDurationAugmentationFactor:
        value.callerDurationAugmentationFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
