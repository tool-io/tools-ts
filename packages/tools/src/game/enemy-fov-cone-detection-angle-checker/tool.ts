import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly observerToTargetVector: readonly number[];
  readonly observerForwardVector: readonly number[];
  readonly callerFullFovDegrees: number;
  readonly callerDetectionRange: number;
  readonly lineOfSightDeclaredClear: boolean;
}>;
export type Output = Readonly<{
  readonly targetDistance: number;
  readonly signedTargetAngleDegrees: number;
  readonly insideCallerFovAndRange: boolean;
  readonly detectableUnderDeclaredLineOfSight: boolean;
}>;
const inputFields = [
  {
    id: "observerToTargetVector",
    label: "Observer to target vector",
    kind: "numberList",
  },
  {
    id: "observerForwardVector",
    label: "Observer forward vector",
    kind: "numberList",
  },
  {
    id: "callerFullFovDegrees",
    label: "Caller full fov degrees",
    kind: "number",
  },
  {
    id: "callerDetectionRange",
    label: "Caller detection range",
    kind: "number",
  },
  {
    id: "lineOfSightDeclaredClear",
    label: "Line of sight declared clear",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerFullFovDegrees, "callerFullFovDegrees");
  nonnegative(input.callerDetectionRange, "callerDetectionRange");
  if (
    input.observerToTargetVector.length !== 2 ||
    input.observerForwardVector.length !== 2 ||
    input.callerFullFovDegrees > 360
  )
    simpleError(
      "vectors",
      "Two-component vectors and full FOV in [0,360] required.",
    );
  const [x, y] = input.observerToTargetVector,
    [fx, fy] = input.observerForwardVector;
  const forwardScale = positive(
      Math.max(Math.abs(fx), Math.abs(fy)),
      "forwardVector",
    ),
    targetScale = Math.max(Math.abs(x), Math.abs(y)),
    sx = targetScale ? x / targetScale : 0,
    sy = targetScale ? y / targetScale : 0,
    sfx = fx / forwardScale,
    sfy = fy / forwardScale;
  const distance = Math.hypot(x, y),
    angle =
      distance === 0
        ? 0
        : (Math.atan2(sfx * sy - sfy * sx, sfx * sx + sfy * sy) * 180) /
          Math.PI,
    inside =
      distance <= input.callerDetectionRange &&
      Math.abs(angle) <= input.callerFullFovDegrees / 2;
  return {
    targetDistance: distance,
    signedTargetAngleDegrees: angle,
    insideCallerFovAndRange: inside,
    detectableUnderDeclaredLineOfSight:
      inside && input.lineOfSightDeclaredClear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observerToTargetVector: [10, 0],
  observerForwardVector: [1, 0],
  callerFullFovDegrees: 90,
  callerDetectionRange: 20,
  lineOfSightDeclaredClear: true,
} satisfies Input;
export const exampleOutput = {
  targetDistance: 10,
  signedTargetAngleDegrees: 0,
  insideCallerFovAndRange: true,
  detectableUnderDeclaredLineOfSight: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/enemy-fov-cone-detection-angle-checker",
  title: "Enemy FOV Cone Detection Angle Check",
  description:
    "Screen caller measured 2D target/forward vectors against inclusive cone/range and separately declared clear sightline; coincident target uses zero angle convention, no automatic occlusion or enemy AI model.",
  inputs: inputFields,
  outputs: [
    { id: "targetDistance", label: "Target distance", kind: "number" },
    {
      id: "signedTargetAngleDegrees",
      label: "Signed target angle degrees",
      kind: "number",
    },
    {
      id: "insideCallerFovAndRange",
      label: "Inside caller fov and range",
      kind: "boolean",
    },
    {
      id: "detectableUnderDeclaredLineOfSight",
      label: "Detectable under declared line of sight",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observerToTargetVector: value.observerToTargetVector as readonly number[],
      observerForwardVector: value.observerForwardVector as readonly number[],
      callerFullFovDegrees: value.callerFullFovDegrees as number,
      callerDetectionRange: value.callerDetectionRange as number,
      lineOfSightDeclaredClear: value.lineOfSightDeclaredClear as boolean,
    }),
});
export const run = tool.execute;
export default tool;
