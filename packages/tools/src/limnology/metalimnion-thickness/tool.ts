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
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly temperaturesC: readonly number[];
  readonly minimumThermalGradientCPerM: number;
}>;
export type Output = Readonly<{
  readonly topMetalimnionDepthM: number;
  readonly bottomMetalimnionDepthM: number;
  readonly metalimnionThicknessM: number;
}>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  { id: "temperaturesC", label: "Temperatures c", kind: "numberList" },
  {
    id: "minimumThermalGradientCPerM",
    label: "Minimum thermal gradient c per m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.minimumThermalGradientCPerM, "minimumThermalGradientCPerM");
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  aligned(input.depthsM, input.temperaturesC, "depthsM");
  ordered(input.depthsM, "depthsM");
  const selected = input.depthsM
      .slice(1)
      .map(
        (z, i) =>
          Math.abs(
            (input.temperaturesC[i + 1] - input.temperaturesC[i]) /
              (z - input.depthsM[i]),
          ) >= input.minimumThermalGradientCPerM,
      ),
    first = selected.indexOf(true),
    last = selected.lastIndexOf(true);
  if (first < 0 || selected.slice(first, last + 1).some((v) => !v))
    simpleError(
      "temperaturesC",
      "Exactly one nonempty contiguous threshold-gradient layer required.",
    );
  const topMetalimnionDepthM = input.depthsM[first],
    bottomMetalimnionDepthM = input.depthsM[last + 1];
  return {
    topMetalimnionDepthM,
    bottomMetalimnionDepthM,
    metalimnionThicknessM: bottomMetalimnionDepthM - topMetalimnionDepthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 5, 10, 15],
  temperaturesC: [20, 19, 9, 8],
  minimumThermalGradientCPerM: 1,
} satisfies Input;
export const exampleOutput = {
  topMetalimnionDepthM: 5,
  bottomMetalimnionDepthM: 10,
  metalimnionThicknessM: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/metalimnion-thickness",
  title: "Metalimnion Thickness",
  description:
    "Locate one contiguous sampled metalimnion using a caller absolute-gradient threshold; disjoint layers are ambiguous and are not merged into a false single thickness.",
  inputs: inputFields,
  outputs: [
    {
      id: "topMetalimnionDepthM",
      label: "Top metalimnion depth m",
      kind: "number",
    },
    {
      id: "bottomMetalimnionDepthM",
      label: "Bottom metalimnion depth m",
      kind: "number",
    },
    {
      id: "metalimnionThicknessM",
      label: "Metalimnion thickness m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      temperaturesC: value.temperaturesC as readonly number[],
      minimumThermalGradientCPerM: value.minimumThermalGradientCPerM as number,
    }),
});
export const run = tool.execute;
export default tool;
