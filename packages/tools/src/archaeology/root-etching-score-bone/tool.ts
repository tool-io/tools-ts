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
  fraction,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly rootEtchedSurfaceAreasMm2: readonly number[];
  readonly observableBoneSurfaceAreasMm2: readonly number[];
  readonly callerScoreLowerCoverageFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly perBoneEtchedSurfaceFractions: readonly number[];
  readonly callerEtchingScoreCodes: readonly number[];
  readonly pooledEtchedSurfaceFraction: number;
}>;
const inputFields = [
  {
    id: "rootEtchedSurfaceAreasMm2",
    label: "Root etched surface areas mm2",
    kind: "numberList",
  },
  {
    id: "observableBoneSurfaceAreasMm2",
    label: "Observable bone surface areas mm2",
    kind: "numberList",
  },
  {
    id: "callerScoreLowerCoverageFractions",
    label: "Caller score lower coverage fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observableBoneSurfaceAreasMm2.forEach((v) =>
    positive(v, "observableBoneSurfaceAreasMm2"),
  );
  input.rootEtchedSurfaceAreasMm2.forEach((v) =>
    nonnegative(v, "rootEtchedSurfaceAreasMm2"),
  );
  input.callerScoreLowerCoverageFractions.forEach((v) =>
    fraction(v, "callerScoreLowerCoverageFractions"),
  );
  aligned(
    input.rootEtchedSurfaceAreasMm2,
    input.observableBoneSurfaceAreasMm2,
    "rootEtchedSurfaceAreasMm2",
  );
  ordered(
    input.callerScoreLowerCoverageFractions,
    "callerScoreLowerCoverageFractions",
  );
  if (
    input.callerScoreLowerCoverageFractions[0] !== 0 ||
    input.callerScoreLowerCoverageFractions.length > 128
  )
    simpleError(
      "scores",
      "At most 128 lower score edges beginning at zero required.",
    );
  const perBoneEtchedSurfaceFractions = input.rootEtchedSurfaceAreasMm2.map(
      (v, i) =>
        fraction(
          v / input.observableBoneSurfaceAreasMm2[i],
          "rootEtchedSurfaceAreasMm2",
        ),
    ),
    callerEtchingScoreCodes = perBoneEtchedSurfaceFractions.map((v) => {
      const i = input.callerScoreLowerCoverageFractions.findIndex((x) => x > v);
      return i < 0 ? input.callerScoreLowerCoverageFractions.length - 1 : i - 1;
    });
  return {
    perBoneEtchedSurfaceFractions,
    callerEtchingScoreCodes,
    pooledEtchedSurfaceFraction:
      input.rootEtchedSurfaceAreasMm2.reduce((a, b) => a + b, 0) /
      input.observableBoneSurfaceAreasMm2.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rootEtchedSurfaceAreasMm2: [1, 2],
  observableBoneSurfaceAreasMm2: [2, 8],
  callerScoreLowerCoverageFractions: [0, 0.2, 0.5],
} satisfies Input;
export const exampleOutput = {
  perBoneEtchedSurfaceFractions: [0.5, 0.25],
  callerEtchingScoreCodes: [2, 1],
  pooledEtchedSurfaceFraction: 0.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/root-etching-score-bone",
  title: "Bone Root Etching Score Tool",
  description:
    "Summarize independently observed root-etching coverage and caller ordinal bands; no automatic mark attribution or physical-damage diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "perBoneEtchedSurfaceFractions",
      label: "Per bone etched surface fractions",
      kind: "numberList",
    },
    {
      id: "callerEtchingScoreCodes",
      label: "Caller etching score codes",
      kind: "numberList",
    },
    {
      id: "pooledEtchedSurfaceFraction",
      label: "Pooled etched surface fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      rootEtchedSurfaceAreasMm2:
        value.rootEtchedSurfaceAreasMm2 as readonly number[],
      observableBoneSurfaceAreasMm2:
        value.observableBoneSurfaceAreasMm2 as readonly number[],
      callerScoreLowerCoverageFractions:
        value.callerScoreLowerCoverageFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
