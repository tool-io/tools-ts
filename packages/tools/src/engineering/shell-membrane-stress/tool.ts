import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualInternalPressurePascals: number;
  readonly actualSphereRadiusMeters: number;
  readonly actualWallThicknessMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInternalPressurePascals",
    label: "Actual internal pressure pascals",
    kind: "number",
  },
  {
    id: "actualSphereRadiusMeters",
    label: "Actual sphere radius meters",
    kind: "number",
  },
  {
    id: "actualWallThicknessMeters",
    label: "Actual wall thickness meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualInternalPressurePascals,
    "actualInternalPressurePascals",
  );
  positive(input.actualSphereRadiusMeters, "actualSphereRadiusMeters");
  positive(input.actualWallThicknessMeters, "actualWallThicknessMeters");
  if (input.actualWallThicknessMeters / input.actualSphereRadiusMeters > 0.1)
    simpleError("shell", "Thin spherical branch t/r≤.1.");
  return {
    value:
      (input.actualInternalPressurePascals * input.actualSphereRadiusMeters) /
      (2 * input.actualWallThicknessMeters),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInternalPressurePascals: 1,
    actualSphereRadiusMeters: 1,
    actualWallThicknessMeters: 0.1,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/shell-membrane-stress",
  title: "Shell Membrane Stress Calculator",
  description:
    "Ideal thin SPHERICAL shell membrane stresspr/(2t), independent t/r\u2264.1, not cylindrical hoop or a shell rating. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
