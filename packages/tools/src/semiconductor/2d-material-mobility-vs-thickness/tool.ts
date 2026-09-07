import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observed2dThicknessNm: readonly number[];
  readonly observedMatchedMobilityCm2VoltSecond: readonly number[];
  readonly queryThicknessNm: number;
}>;
export type Output = Readonly<{
  readonly interpolated2dMobilityCm2VoltSecond: number;
  readonly localMeasuredResponseDerivative: number;
}>;
const inputFields = [
  {
    id: "observed2dThicknessNm",
    label: "Observed2d thickness nm",
    kind: "numberList",
  },
  {
    id: "observedMatchedMobilityCm2VoltSecond",
    label: "Observed matched mobility cm2 volt second",
    kind: "numberList",
  },
  { id: "queryThicknessNm", label: "Query thickness nm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedMobilityCm2VoltSecond.forEach((v) =>
    positive(v, "observedMatchedMobilityCm2VoltSecond"),
  );
  input.observed2dThicknessNm.forEach((v) =>
    nonnegative(v, "observed2dThicknessNm"),
  );
  nonnegative(input.queryThicknessNm, "queryThicknessNm");
  const result = curve(
    input.observed2dThicknessNm,
    input.observedMatchedMobilityCm2VoltSecond,
    input.queryThicknessNm,
  );
  return {
    interpolated2dMobilityCm2VoltSecond: result.value,
    localMeasuredResponseDerivative: result.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observed2dThicknessNm: [1, 2, 3],
  observedMatchedMobilityCm2VoltSecond: [2, 4, 8],
  queryThicknessNm: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolated2dMobilityCm2VoltSecond: 6,
  localMeasuredResponseDerivative: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/2d-material-mobility-vs-thickness",
  title: "Semiconductor 2d Material Mobility Vs Thickness Calculator",
  description:
    "Read independently measured same-material thickness-dependent mobility, not discrete layer-number assignment. Independently matched measured piecewise-linear curve only, local slope retained; no extrapolation, invented material constants, process recipe or safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolated2dMobilityCm2VoltSecond",
      label: "Interpolated2d mobility cm2 volt second",
      kind: "number",
    },
    {
      id: "localMeasuredResponseDerivative",
      label: "Local measured response derivative",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observed2dThicknessNm: value.observed2dThicknessNm as readonly number[],
      observedMatchedMobilityCm2VoltSecond:
        value.observedMatchedMobilityCm2VoltSecond as readonly number[],
      queryThicknessNm: value.queryThicknessNm as number,
    }),
});
export const run = tool.execute;
export default tool;
