import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch33-shared.js";
export type Input = Readonly<{
  readonly measuredCycChordWidthM: number;
  readonly measuredCycSagittaM: number;
}>;
export type Output = Readonly<{
  readonly circularArcRadiusM: number;
  readonly circularArcAngleDegrees: number;
  readonly arcFabricWidthM: number;
}>;
const inputFields = [
  {
    id: "measuredCycChordWidthM",
    label: "Measured cyc chord width m",
    kind: "number",
  },
  {
    id: "measuredCycSagittaM",
    label: "Measured cyc sagitta m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredCycChordWidthM, "measuredCycChordWidthM");
  positive(input.measuredCycSagittaM, "measuredCycSagittaM");
  const w = input.measuredCycChordWidthM,
    s = input.measuredCycSagittaM;
  if (s > w / 2)
    simpleError(
      "arc",
      "This measured minor circular arc assumes sagitta ≤ half chord.",
    );
  const radius = (w * w) / (8 * s) + s / 2,
    angle = 4 * Math.atan2(2 * s, w);
  return {
    circularArcRadiusM: radius,
    circularArcAngleDegrees: (angle * 180) / Math.PI,
    arcFabricWidthM: radius * angle,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredCycChordWidthM: 4,
  measuredCycSagittaM: 2,
} satisfies Input;
export const exampleOutput = {
  circularArcRadiusM: 2,
  circularArcAngleDegrees: 180,
  arcFabricWidthM: 6.283185307179586,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/cyc-cyclorama-curve-radius-width-calculator",
  title: "Cyc Cyclorama Curve Radius Width Calculator",
  description:
    "Infer circular cyc minor-arc radius/length from actual chord and sagitta; not floorplan coordinate transforms, noncircular curves, fabric fullness or structural layout.",
  inputs: inputFields,
  outputs: [
    {
      id: "circularArcRadiusM",
      label: "Circular arc radius m",
      kind: "number",
    },
    {
      id: "circularArcAngleDegrees",
      label: "Circular arc angle degrees",
      kind: "number",
    },
    { id: "arcFabricWidthM", label: "Arc fabric width m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      measuredCycChordWidthM: value.measuredCycChordWidthM as number,
      measuredCycSagittaM: value.measuredCycSagittaM as number,
    }),
});
export const run = tool.execute;
export default tool;
