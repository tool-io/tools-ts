import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly horizontalEndWireForceN: number;
  readonly wireAttachmentHeightM: number;
  readonly anchorAttachmentHeightM: number;
  readonly anchorLineAngleAboveHorizontalDegrees: number;
  readonly callerAnchorTensionLimitN: number;
}>;
export type Output = Readonly<{
  readonly requiredIdealAnchorLineTensionN: number;
  readonly anchorVerticalForceN: number;
  readonly aboveCallerAnchorTensionLimit: boolean;
}>;
const inputFields = [
  {
    id: "horizontalEndWireForceN",
    label: "Horizontal end wire force n",
    kind: "number",
  },
  {
    id: "wireAttachmentHeightM",
    label: "Wire attachment height m",
    kind: "number",
  },
  {
    id: "anchorAttachmentHeightM",
    label: "Anchor attachment height m",
    kind: "number",
  },
  {
    id: "anchorLineAngleAboveHorizontalDegrees",
    label: "Anchor line angle above horizontal degrees",
    kind: "number",
  },
  {
    id: "callerAnchorTensionLimitN",
    label: "Caller anchor tension limit n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.wireAttachmentHeightM, "wireAttachmentHeightM");
  positive(input.anchorAttachmentHeightM, "anchorAttachmentHeightM");
  positive(input.callerAnchorTensionLimitN, "callerAnchorTensionLimitN");
  nonnegative(input.horizontalEndWireForceN, "horizontalEndWireForceN");
  if (
    input.anchorLineAngleAboveHorizontalDegrees < 0 ||
    input.anchorLineAngleAboveHorizontalDegrees >= 90
  )
    simpleError("angle", "Anchor angle in [0,90) required.");
  const angle = (input.anchorLineAngleAboveHorizontalDegrees * Math.PI) / 180,
    t =
      (input.horizontalEndWireForceN * input.wireAttachmentHeightM) /
      (input.anchorAttachmentHeightM * Math.cos(angle));
  return {
    requiredIdealAnchorLineTensionN: t,
    anchorVerticalForceN: t * Math.sin(angle),
    aboveCallerAnchorTensionLimit: t > input.callerAnchorTensionLimitN,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  horizontalEndWireForceN: 100,
  wireAttachmentHeightM: 1,
  anchorAttachmentHeightM: 2,
  anchorLineAngleAboveHorizontalDegrees: 60,
  callerAnchorTensionLimitN: 150,
} satisfies Input;
export const exampleOutput = {
  requiredIdealAnchorLineTensionN: 100,
  anchorVerticalForceN: 86.60254037844386,
  aboveCallerAnchorTensionLimit: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/end-post-anchor-angle-leaning",
  title: "End Post Anchor Angle Leaning",
  description:
    "Balance declared horizontal end-wire overturning moment with supplied ideal anchor lever height/angle and tension limit; ignores post lean, foundation/soil capacity and transient loads, not a construction/safety recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredIdealAnchorLineTensionN",
      label: "Required ideal anchor line tension n",
      kind: "number",
    },
    {
      id: "anchorVerticalForceN",
      label: "Anchor vertical force n",
      kind: "number",
    },
    {
      id: "aboveCallerAnchorTensionLimit",
      label: "Above caller anchor tension limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      horizontalEndWireForceN: value.horizontalEndWireForceN as number,
      wireAttachmentHeightM: value.wireAttachmentHeightM as number,
      anchorAttachmentHeightM: value.anchorAttachmentHeightM as number,
      anchorLineAngleAboveHorizontalDegrees:
        value.anchorLineAngleAboveHorizontalDegrees as number,
      callerAnchorTensionLimitN: value.callerAnchorTensionLimitN as number,
    }),
});
export const run = tool.execute;
export default tool;
