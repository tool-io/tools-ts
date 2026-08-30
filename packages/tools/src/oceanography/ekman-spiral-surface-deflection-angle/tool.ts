import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly eastwardWindStressNPerM2: number;
  readonly northwardWindStressNPerM2: number;
  readonly waterDensityKgPerM3: number;
  readonly verticalEddyViscosityM2PerSecond: number;
  readonly signedCoriolisPerSecond: number;
  readonly depthBelowSurfaceM: number;
}>;
export type Output = Readonly<{
  readonly eastwardCurrentMPerSecond: number;
  readonly northwardCurrentMPerSecond: number;
  readonly speedMPerSecond: number;
}>;
const inputFields = [
  {
    id: "eastwardWindStressNPerM2",
    label: "Eastward wind stress n per m2",
    kind: "number",
  },
  {
    id: "northwardWindStressNPerM2",
    label: "Northward wind stress n per m2",
    kind: "number",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "verticalEddyViscosityM2PerSecond",
    label: "Vertical eddy viscosity m2 per second",
    kind: "number",
  },
  {
    id: "signedCoriolisPerSecond",
    label: "Signed coriolis per second",
    kind: "number",
  },
  { id: "depthBelowSurfaceM", label: "Depth below surface m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(
    input.verticalEddyViscosityM2PerSecond,
    "verticalEddyViscosityM2PerSecond",
  );
  nonnegative(input.depthBelowSurfaceM, "depthBelowSurfaceM");
  const f = positive(
      Math.abs(input.signedCoriolisPerSecond),
      "signedCoriolisPerSecond",
    ),
    sign = Math.sign(input.signedCoriolisPerSecond),
    d = Math.sqrt((2 * input.verticalEddyViscosityM2PerSecond) / f),
    x = input.depthBelowSurfaceM / d,
    scale =
      Math.exp(-x) /
      (input.waterDensityKgPerM3 *
        Math.sqrt(2 * input.verticalEddyViscosityM2PerSecond * f)),
    a = Math.cos(x) - Math.sin(x),
    b = -sign * (Math.cos(x) + Math.sin(x)),
    eastwardCurrentMPerSecond =
      scale *
      (a * input.eastwardWindStressNPerM2 -
        b * input.northwardWindStressNPerM2),
    northwardCurrentMPerSecond =
      scale *
      (b * input.eastwardWindStressNPerM2 +
        a * input.northwardWindStressNPerM2);
  return {
    eastwardCurrentMPerSecond,
    northwardCurrentMPerSecond,
    speedMPerSecond: Math.hypot(
      eastwardCurrentMPerSecond,
      northwardCurrentMPerSecond,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eastwardWindStressNPerM2: 1,
  northwardWindStressNPerM2: 0,
  waterDensityKgPerM3: 1000,
  verticalEddyViscosityM2PerSecond: 0.5,
  signedCoriolisPerSecond: 1,
  depthBelowSurfaceM: 0,
} satisfies Input;
export const exampleOutput = {
  eastwardCurrentMPerSecond: 0.001,
  northwardCurrentMPerSecond: -0.001,
  speedMPerSecond: 0.0014142135623730952,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/ekman-spiral-surface-deflection-angle",
  title: "Ekman Spiral Surface Deflection Angle",
  description:
    "Calculate a constant-viscosity steady Ekman current vector at depth, including hemisphere-dependent rotation and exponential decay; not a universal observed 45-degree surface rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "eastwardCurrentMPerSecond",
      label: "Eastward current m per second",
      kind: "number",
    },
    {
      id: "northwardCurrentMPerSecond",
      label: "Northward current m per second",
      kind: "number",
    },
    { id: "speedMPerSecond", label: "Speed m per second", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      eastwardWindStressNPerM2: value.eastwardWindStressNPerM2 as number,
      northwardWindStressNPerM2: value.northwardWindStressNPerM2 as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      verticalEddyViscosityM2PerSecond:
        value.verticalEddyViscosityM2PerSecond as number,
      signedCoriolisPerSecond: value.signedCoriolisPerSecond as number,
      depthBelowSurfaceM: value.depthBelowSurfaceM as number,
    }),
});
export const run = tool.execute;
export default tool;
