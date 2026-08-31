import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly suitcaseWeightForceN: number;
  readonly callerEffectiveRollingFriction: number;
  readonly pullHandHeightM: number;
  readonly handleAttachmentHeightM: number;
  readonly horizontalHandLeadM: number;
}>;
export type Output = Readonly<{
  readonly modelPullAngleDegrees: number;
  readonly modelRequiredPullForceN: number;
  readonly modelWheelNormalForceN: number;
}>;
const inputFields = [
  {
    id: "suitcaseWeightForceN",
    label: "Suitcase weight force n",
    kind: "number",
  },
  {
    id: "callerEffectiveRollingFriction",
    label: "Caller effective rolling friction",
    kind: "number",
  },
  { id: "pullHandHeightM", label: "Pull hand height m", kind: "number" },
  {
    id: "handleAttachmentHeightM",
    label: "Handle attachment height m",
    kind: "number",
  },
  {
    id: "horizontalHandLeadM",
    label: "Horizontal hand lead m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.suitcaseWeightForceN, "suitcaseWeightForceN");
  positive(input.horizontalHandLeadM, "horizontalHandLeadM");
  nonnegative(
    input.callerEffectiveRollingFriction,
    "callerEffectiveRollingFriction",
  );
  nonnegative(input.pullHandHeightM, "pullHandHeightM");
  nonnegative(input.handleAttachmentHeightM, "handleAttachmentHeightM");
  const theta = Math.atan2(
      input.pullHandHeightM - input.handleAttachmentHeightM,
      input.horizontalHandLeadM,
    ),
    den = positive(
      Math.cos(theta) + input.callerEffectiveRollingFriction * Math.sin(theta),
      "pullDenominator",
    ),
    f =
      (input.callerEffectiveRollingFriction * input.suitcaseWeightForceN) / den,
    n = nonnegative(
      input.suitcaseWeightForceN - f * Math.sin(theta),
      "wheelNormal",
    );
  return {
    modelPullAngleDegrees: (theta * 180) / Math.PI,
    modelRequiredPullForceN: f,
    modelWheelNormalForceN: n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  suitcaseWeightForceN: 100,
  callerEffectiveRollingFriction: 0.1,
  pullHandHeightM: 1,
  handleAttachmentHeightM: 0.5,
  horizontalHandLeadM: 0.5,
} satisfies Input;
export const exampleOutput = {
  modelPullAngleDegrees: 45,
  modelRequiredPullForceN: 12.856486930664499,
  modelWheelNormalForceN: 90.9090909090909,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/suitcase-drag-force-estimate",
  title: "Suitcase Handle Height Drag Friction Force Estimate Calculator",
  description:
    "Solve steady pull force with handle/hand geometry and vertical unloading feedback, unlike simple μN friction; caller rolling coefficient omits starts/bumps/acceleration and does not establish safe drag handling.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelPullAngleDegrees",
      label: "Model pull angle degrees",
      kind: "number",
    },
    {
      id: "modelRequiredPullForceN",
      label: "Model required pull force n",
      kind: "number",
    },
    {
      id: "modelWheelNormalForceN",
      label: "Model wheel normal force n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      suitcaseWeightForceN: value.suitcaseWeightForceN as number,
      callerEffectiveRollingFriction:
        value.callerEffectiveRollingFriction as number,
      pullHandHeightM: value.pullHandHeightM as number,
      handleAttachmentHeightM: value.handleAttachmentHeightM as number,
      horizontalHandLeadM: value.horizontalHandLeadM as number,
    }),
});
export const run = tool.execute;
export default tool;
