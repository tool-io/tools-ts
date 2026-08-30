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
  crossing,
} from "../shared.js";
export type Input = Readonly<{
  readonly enclosedContourAreasM2: readonly number[];
  readonly contourMassLoadingsGramsPerM2: readonly number[];
  readonly targetMassLoadingGramsPerM2: number;
}>;
export type Output = Readonly<{
  readonly interpolatedIsomassAreaM2: number;
  readonly equivalentCircularRadiusM: number;
}>;
const inputFields = [
  {
    id: "enclosedContourAreasM2",
    label: "Enclosed contour areas m2",
    kind: "numberList",
  },
  {
    id: "contourMassLoadingsGramsPerM2",
    label: "Contour mass loadings grams per m2",
    kind: "numberList",
  },
  {
    id: "targetMassLoadingGramsPerM2",
    label: "Target mass loading grams per m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.enclosedContourAreasM2.forEach((v) =>
    positive(v, "enclosedContourAreasM2"),
  );
  input.contourMassLoadingsGramsPerM2.forEach((v) =>
    positive(v, "contourMassLoadingsGramsPerM2"),
  );
  positive(input.targetMassLoadingGramsPerM2, "targetMassLoadingGramsPerM2");
  ordered(input.enclosedContourAreasM2, "enclosedContourAreasM2");
  aligned(
    input.enclosedContourAreasM2,
    input.contourMassLoadingsGramsPerM2,
    "contours",
  );
  if (
    input.contourMassLoadingsGramsPerM2.some(
      (v, i) => i > 0 && v >= input.contourMassLoadingsGramsPerM2[i - 1],
    )
  )
    simpleError(
      "contours",
      "Strictly declining load versus enclosed area required.",
    );
  const rootArea = crossing(
      input.enclosedContourAreasM2.map(Math.sqrt),
      input.contourMassLoadingsGramsPerM2.map(Math.log),
      Math.log(input.targetMassLoadingGramsPerM2),
    ),
    interpolatedIsomassAreaM2 = rootArea ** 2;
  return {
    interpolatedIsomassAreaM2,
    equivalentCircularRadiusM: rootArea / Math.sqrt(Math.PI),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  enclosedContourAreasM2: [100, 400, 900],
  contourMassLoadingsGramsPerM2: [100, 10, 1],
  targetMassLoadingGramsPerM2: 10,
} satisfies Input;
export const exampleOutput = {
  interpolatedIsomassAreaM2: 400,
  equivalentCircularRadiusM: 11.283791670955125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/isomass-loading-gm2-contour",
  title: "Isomass Loading GM2 Contour Tool",
  description:
    "Locate a target isomass contour by log loading versus square-root enclosed area; supplied areas require no coordinates, circular radius is an equivalent proxy, not a mapped boundary.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedIsomassAreaM2",
      label: "Interpolated isomass area m2",
      kind: "number",
    },
    {
      id: "equivalentCircularRadiusM",
      label: "Equivalent circular radius m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      enclosedContourAreasM2: value.enclosedContourAreasM2 as readonly number[],
      contourMassLoadingsGramsPerM2:
        value.contourMassLoadingsGramsPerM2 as readonly number[],
      targetMassLoadingGramsPerM2: value.targetMassLoadingGramsPerM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
