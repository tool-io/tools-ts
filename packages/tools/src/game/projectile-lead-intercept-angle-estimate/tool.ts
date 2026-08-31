import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly relativeTargetPosition: readonly number[];
  readonly targetVelocity: readonly number[];
  readonly projectileSpeed: number;
  readonly callerMaximumInterceptSeconds: number;
}>;
export type Output = Readonly<{
  readonly interceptFound: boolean;
  readonly interceptTimeSeconds: number;
  readonly leadAngleDegrees: number;
  readonly relativeInterceptCoordinates: readonly number[];
}>;
const inputFields = [
  {
    id: "relativeTargetPosition",
    label: "Relative target position",
    kind: "numberList",
  },
  { id: "targetVelocity", label: "Target velocity", kind: "numberList" },
  { id: "projectileSpeed", label: "Projectile speed", kind: "number" },
  {
    id: "callerMaximumInterceptSeconds",
    label: "Caller maximum intercept seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.projectileSpeed, "projectileSpeed");
  nonnegative(
    input.callerMaximumInterceptSeconds,
    "callerMaximumInterceptSeconds",
  );
  if (
    input.relativeTargetPosition.length !== 2 ||
    input.targetVelocity.length !== 2 ||
    [
      ...input.relativeTargetPosition,
      ...input.targetVelocity,
      input.projectileSpeed,
    ].some((v) => Math.abs(v) > 1000000)
  )
    simpleError(
      "vectors",
      "Bounded two-dimensional vectors and speed ≤10^6 required.",
    );
  const [x, y] = input.relativeTargetPosition,
    [vx, vy] = input.targetVelocity,
    a = vx * vx + vy * vy - input.projectileSpeed ** 2,
    b = 2 * (x * vx + y * vy),
    c = x * x + y * y,
    candidates: number[] = [];
  if (c === 0) candidates.push(0);
  else if (a === 0) {
    if (b !== 0) candidates.push(-c / b);
  } else {
    const disc = b * b - 4 * a * c;
    if (disc >= 0) {
      const root = Math.sqrt(disc),
        q = -0.5 * (b + (b >= 0 ? root : -root));
      if (q !== 0) candidates.push(q / a, c / q);
      else candidates.push(-b / (2 * a));
    }
  }
  const times = candidates
    .filter(
      (t) =>
        Number.isFinite(t) &&
        t >= 0 &&
        t <= input.callerMaximumInterceptSeconds,
    )
    .sort((a, b) => a - b);
  if (!times.length)
    return {
      interceptFound: false,
      interceptTimeSeconds: -1,
      leadAngleDegrees: 0,
      relativeInterceptCoordinates: [],
    };
  const t = times[0],
    point = [x + vx * t, y + vy * t];
  return {
    interceptFound: true,
    interceptTimeSeconds: t,
    leadAngleDegrees: (Math.atan2(point[1], point[0]) * 180) / Math.PI,
    relativeInterceptCoordinates: point,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  relativeTargetPosition: [100, 0],
  targetVelocity: [0, 0],
  projectileSpeed: 10,
  callerMaximumInterceptSeconds: 20,
} satisfies Input;
export const exampleOutput = {
  interceptFound: true,
  interceptTimeSeconds: 10,
  leadAngleDegrees: 0,
  relativeInterceptCoordinates: [100, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/projectile-lead-intercept-angle-estimate",
  title: "Projectile Lead Intercept Angle Estimate",
  description:
    "Solve stable constant-velocity 2D projectile interception within explicit caller horizon, preserving unreachable/time-censored cases as false/−1/empty point; angle zero is sentinel when absent or already coincident. No gravity, acceleration or collision geometry.",
  inputs: inputFields,
  outputs: [
    { id: "interceptFound", label: "Intercept found", kind: "boolean" },
    {
      id: "interceptTimeSeconds",
      label: "Intercept time seconds",
      kind: "number",
    },
    { id: "leadAngleDegrees", label: "Lead angle degrees", kind: "number" },
    {
      id: "relativeInterceptCoordinates",
      label: "Relative intercept coordinates",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      relativeTargetPosition: value.relativeTargetPosition as readonly number[],
      targetVelocity: value.targetVelocity as readonly number[],
      projectileSpeed: value.projectileSpeed as number,
      callerMaximumInterceptSeconds:
        value.callerMaximumInterceptSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
