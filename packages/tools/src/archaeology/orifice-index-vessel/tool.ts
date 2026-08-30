import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly orificeMajorDiametersMm: readonly number[];
  readonly orificeMinorDiametersMm: readonly number[];
  readonly bodyMaximumDiametersMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly equivalentCircularOrificeDiametersMm: readonly number[];
  readonly orificeToBodyIndexesPercent: readonly number[];
}>;
const inputFields = [
  {
    id: "orificeMajorDiametersMm",
    label: "Orifice major diameters mm",
    kind: "numberList",
  },
  {
    id: "orificeMinorDiametersMm",
    label: "Orifice minor diameters mm",
    kind: "numberList",
  },
  {
    id: "bodyMaximumDiametersMm",
    label: "Body maximum diameters mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.orificeMajorDiametersMm.forEach((v) =>
    positive(v, "orificeMajorDiametersMm"),
  );
  input.orificeMinorDiametersMm.forEach((v) =>
    positive(v, "orificeMinorDiametersMm"),
  );
  input.bodyMaximumDiametersMm.forEach((v) =>
    positive(v, "bodyMaximumDiametersMm"),
  );
  aligned(
    input.orificeMajorDiametersMm,
    input.orificeMinorDiametersMm,
    "orificeMajorDiametersMm",
  );
  aligned(
    input.orificeMajorDiametersMm,
    input.bodyMaximumDiametersMm,
    "orificeMajorDiametersMm",
  );
  if (
    input.orificeMajorDiametersMm.some(
      (v, i) =>
        v < input.orificeMinorDiametersMm[i] ||
        v > input.bodyMaximumDiametersMm[i],
    )
  )
    simpleError(
      "diameters",
      "Minor ≤ major orifice ≤ maximum body diameter required.",
    );
  const equivalentCircularOrificeDiametersMm =
    input.orificeMajorDiametersMm.map((a, i) =>
      Math.sqrt(a * input.orificeMinorDiametersMm[i]),
    );
  return {
    equivalentCircularOrificeDiametersMm,
    orificeToBodyIndexesPercent: equivalentCircularOrificeDiametersMm.map(
      (v, i) => (100 * v) / input.bodyMaximumDiametersMm[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orificeMajorDiametersMm: [100, 200],
  orificeMinorDiametersMm: [80, 100],
  bodyMaximumDiametersMm: [200, 200],
} satisfies Input;
export const exampleOutput = {
  equivalentCircularOrificeDiametersMm: [89.44271909999159, 141.4213562373095],
  orificeToBodyIndexesPercent: [44.721359549995796, 70.71067811865476],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/orifice-index-vessel",
  title: "Orifice Index Vessel",
  description:
    "Compute area-equivalent elliptical vessel mouth and per-vessel orifice/body index, not a fixed circular diameter ratio or functional classification.",
  inputs: inputFields,
  outputs: [
    {
      id: "equivalentCircularOrificeDiametersMm",
      label: "Equivalent circular orifice diameters mm",
      kind: "numberList",
    },
    {
      id: "orificeToBodyIndexesPercent",
      label: "Orifice to body indexes percent",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      orificeMajorDiametersMm:
        value.orificeMajorDiametersMm as readonly number[],
      orificeMinorDiametersMm:
        value.orificeMinorDiametersMm as readonly number[],
      bodyMaximumDiametersMm: value.bodyMaximumDiametersMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
