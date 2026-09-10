import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualOxideApertureRadiusMeters: number;
  readonly independentlyMeasuredUniformCurrentDensityAmpsPerSquareMeter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOxideApertureRadiusMeters",
    label: "Actual oxide aperture radius meters",
    kind: "number",
  },
  {
    id: "independentlyMeasuredUniformCurrentDensityAmpsPerSquareMeter",
    label:
      "Independently measured uniform current density amps per square meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualOxideApertureRadiusMeters, "radius");
  nonnegative(
    input.independentlyMeasuredUniformCurrentDensityAmpsPerSquareMeter,
    "J",
  );
  return {
    conditionalOxideApertureCurrentAmps:
      Math.PI *
      input.actualOxideApertureRadiusMeters ** 2 *
      input.independentlyMeasuredUniformCurrentDensityAmpsPerSquareMeter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualOxideApertureRadiusMeters: 2,
    independentlyMeasuredUniformCurrentDensityAmpsPerSquareMeter: 3,
  },
  output: {
    result: { conditionalOxideApertureCurrentAmps: 37.69911184307752 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/vcsel-oxide-confined-current",
  title: "Semiconductor Vcsel Oxide Confined Current Calculator",
  description:
    "Ideal uniform-current circular VCSELoxide aperture J\u03c0r\u00b2with actual radius, not diameter. Current crowding, leakage, active aperture and operating safety external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
