import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, shape } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedHingePatternLocalXyMm: readonly (readonly number[])[];
  readonly observedHingePatternOriginMm: readonly number[];
  readonly callerPatternRotationDegrees: number;
  readonly observedDoorPanelWidthMm: number;
  readonly observedDoorPanelHeightMm: number;
}>;
export type Output = Readonly<{
  readonly translatedHingeBoreCentersMm: readonly (readonly number[])[];
  readonly minimumCenterToPanelEdgeMm: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedHingePatternLocalXyMm",
    label: "Caller verified hinge pattern local xy mm",
    kind: "matrix",
  },
  {
    id: "observedHingePatternOriginMm",
    label: "Observed hinge pattern origin mm",
    kind: "numberList",
  },
  {
    id: "callerPatternRotationDegrees",
    label: "Caller pattern rotation degrees",
    kind: "number",
  },
  {
    id: "observedDoorPanelWidthMm",
    label: "Observed door panel width mm",
    kind: "number",
  },
  {
    id: "observedDoorPanelHeightMm",
    label: "Observed door panel height mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedDoorPanelWidthMm, "observedDoorPanelWidthMm");
  positive(input.observedDoorPanelHeightMm, "observedDoorPanelHeightMm");
  if (
    shape(input.callerVerifiedHingePatternLocalXyMm, "pattern") !== 2 ||
    input.observedHingePatternOriginMm.length !== 2
  )
    simpleError(
      "pattern",
      "Explicit local2D manufacturer pattern and measured origin.",
    );
  const angle = (input.callerPatternRotationDegrees * Math.PI) / 180,
    c = Math.cos(angle),
    s = Math.sin(angle),
    points = input.callerVerifiedHingePatternLocalXyMm.map(([x, y]) => [
      input.observedHingePatternOriginMm[0] + c * x - s * y,
      input.observedHingePatternOriginMm[1] + s * x + c * y,
    ]);
  return {
    translatedHingeBoreCentersMm: points,
    minimumCenterToPanelEdgeMm: Math.min(
      ...points.flatMap(([x, y]) => [
        x,
        y,
        input.observedDoorPanelWidthMm - x,
        input.observedDoorPanelHeightMm - y,
      ]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedHingePatternLocalXyMm: [
    [0, 0],
    [10, 0],
  ],
  observedHingePatternOriginMm: [20, 30],
  callerPatternRotationDegrees: 90,
  observedDoorPanelWidthMm: 100,
  observedDoorPanelHeightMm: 100,
} satisfies Input;
export const exampleOutput = {
  translatedHingeBoreCentersMm: [
    [20, 30],
    [20, 40],
  ],
  minimumCenterToPanelEdgeMm: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/beschlag-topfband-bohrbild",
  title: "Topfband Bohrbild Calculator",
  description:
    "Translate independently verified hinge bore pattern about actual installation origin/rotation, signed edge crossing retained; center clearance is not bore-radius clearance, CNC instruction or fit/strength approval. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "translatedHingeBoreCentersMm",
      label: "Translated hinge bore centers mm",
      kind: "matrix",
    },
    {
      id: "minimumCenterToPanelEdgeMm",
      label: "Minimum center to panel edge mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedHingePatternLocalXyMm:
        value.callerVerifiedHingePatternLocalXyMm as readonly (readonly number[])[],
      observedHingePatternOriginMm:
        value.observedHingePatternOriginMm as readonly number[],
      callerPatternRotationDegrees:
        value.callerPatternRotationDegrees as number,
      observedDoorPanelWidthMm: value.observedDoorPanelWidthMm as number,
      observedDoorPanelHeightMm: value.observedDoorPanelHeightMm as number,
    }),
});
export const run = tool.execute;
export default tool;
