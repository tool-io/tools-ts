import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly coverDepthM: number;
  readonly influenceAngleFromVerticalDegrees: number;
  readonly panelWidthM: number;
}>;
export type Output = Readonly<{
  readonly influenceRadiusM: number;
  readonly geometricTroughWidthM: number;
}>;
const inputFields = [
  { id: "coverDepthM", label: "Cover depth m", kind: "number" },
  {
    id: "influenceAngleFromVerticalDegrees",
    label: "Influence angle from vertical degrees",
    kind: "number",
  },
  { id: "panelWidthM", label: "Panel width m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.coverDepthM, "coverDepthM");
  nonnegative(input.panelWidthM, "panelWidthM");
  if (
    input.influenceAngleFromVerticalDegrees < 0 ||
    input.influenceAngleFromVerticalDegrees >= 90
  )
    simpleError(
      "influenceAngleFromVerticalDegrees",
      "Angle in [0,90) from vertical required.",
    );
  const influenceRadiusM =
    input.coverDepthM *
    Math.tan((input.influenceAngleFromVerticalDegrees * Math.PI) / 180);
  return {
    influenceRadiusM,
    geometricTroughWidthM: input.panelWidthM + 2 * influenceRadiusM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coverDepthM: 100,
  influenceAngleFromVerticalDegrees: 45,
  panelWidthM: 200,
} satisfies Input;
export const exampleOutput = {
  influenceRadiusM: 100,
  geometricTroughWidthM: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/subsidence-trough-width",
  title: "Subsidence Trough Width",
  description:
    "Estimate geometric influence envelope from panel width, depth and caller angle from vertical; does not infer geology or Gaussian trough scale.",
  inputs: inputFields,
  outputs: [
    { id: "influenceRadiusM", label: "Influence radius m", kind: "number" },
    {
      id: "geometricTroughWidthM",
      label: "Geometric trough width m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      coverDepthM: value.coverDepthM as number,
      influenceAngleFromVerticalDegrees:
        value.influenceAngleFromVerticalDegrees as number,
      panelWidthM: value.panelWidthM as number,
    }),
});
export const run = tool.execute;
export default tool;
