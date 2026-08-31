import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly windowRayTravelDirection: readonly number[];
  readonly screenOutwardUnitNormal: readonly number[];
  readonly screenToViewerDirection: readonly number[];
  readonly callerSpecularViewerConeDegrees: number;
}>;
export type Output = Readonly<{
  readonly reflectedRayUnitDirection: readonly number[];
  readonly reflectionViewerSeparationDegrees: number;
  readonly viewerInsideCallerSpecularCone: boolean;
}>;
const inputFields = [
  {
    id: "windowRayTravelDirection",
    label: "Window ray travel direction",
    kind: "numberList",
  },
  {
    id: "screenOutwardUnitNormal",
    label: "Screen outward unit normal",
    kind: "numberList",
  },
  {
    id: "screenToViewerDirection",
    label: "Screen to viewer direction",
    kind: "numberList",
  },
  {
    id: "callerSpecularViewerConeDegrees",
    label: "Caller specular viewer cone degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerSpecularViewerConeDegrees,
    "callerSpecularViewerConeDegrees",
  );
  const normalize = (v: readonly number[]) => {
      if (v.length !== 3) simpleError("vector", "Three components required.");
      const m = positive(Math.hypot(...v), "vectorMagnitude");
      return v.map((x) => x / m);
    },
    i = normalize(input.windowRayTravelDirection),
    n = normalize(input.screenOutwardUnitNormal),
    v = normalize(input.screenToViewerDirection);
  if (input.callerSpecularViewerConeDegrees > 90)
    simpleError("cone", "Caller specular cone at most 90 degrees required.");
  const dot = i.reduce((s, x, j) => s + x * n[j], 0);
  if (dot >= 0)
    simpleError("ray", "Incoming ray must travel onto outward screen face.");
  const r = i.map((x, j) => x - 2 * dot * n[j]),
    a =
      (Math.acos(
        Math.max(
          -1,
          Math.min(
            1,
            r.reduce((s, x, j) => s + x * v[j], 0),
          ),
        ),
      ) *
        180) /
      Math.PI;
  return {
    reflectedRayUnitDirection: r,
    reflectionViewerSeparationDegrees: a,
    viewerInsideCallerSpecularCone: a <= input.callerSpecularViewerConeDegrees,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  windowRayTravelDirection: [0, 0, -1],
  screenOutwardUnitNormal: [0, 0, 1],
  screenToViewerDirection: [0, 0, 1],
  callerSpecularViewerConeDegrees: 5,
} satisfies Input;
export const exampleOutput = {
  reflectedRayUnitDirection: [0, 0, 1],
  reflectionViewerSeparationDegrees: 0,
  viewerInsideCallerSpecularCone: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/screen-glare-angle-risk",
  title: "Screen Glare Window Reflection Angle Risk Checker",
  description:
    "Screen measured window-to-screen ray reflection against actual viewer cone using supplied 3D vectors, not a universal glare-angle rule; assumes planar ideal specular surface, no comfort or eye-safety diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "reflectedRayUnitDirection",
      label: "Reflected ray unit direction",
      kind: "numberList",
    },
    {
      id: "reflectionViewerSeparationDegrees",
      label: "Reflection viewer separation degrees",
      kind: "number",
    },
    {
      id: "viewerInsideCallerSpecularCone",
      label: "Viewer inside caller specular cone",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      windowRayTravelDirection:
        value.windowRayTravelDirection as readonly number[],
      screenOutwardUnitNormal:
        value.screenOutwardUnitNormal as readonly number[],
      screenToViewerDirection:
        value.screenToViewerDirection as readonly number[],
      callerSpecularViewerConeDegrees:
        value.callerSpecularViewerConeDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
