import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, classifyTrewartha } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly monthlyTemperatureC: readonly number[];
  readonly monthlyPrecipitationMm: readonly number[];
  readonly northernHemisphere: boolean;
}>;
export type Output = Readonly<{
  readonly trewarthaThermalGroup: string;
  readonly monthsAtLeastTenC: number;
  readonly callerModelDryThresholdMm: number;
}>;
const inputFields = [
  {
    id: "monthlyTemperatureC",
    label: "Monthly temperature c",
    kind: "numberList",
  },
  {
    id: "monthlyPrecipitationMm",
    label: "Monthly precipitation mm",
    kind: "numberList",
  },
  { id: "northernHemisphere", label: "Northern hemisphere", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return classifyTrewartha(
    input.monthlyTemperatureC,
    input.monthlyPrecipitationMm,
    input.northernHemisphere,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyTemperatureC: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
  monthlyPrecipitationMm: [
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  ],
  northernHemisphere: true,
} satisfies Input;
export const exampleOutput = {
  trewarthaThermalGroup: "A",
  monthsAtLeastTenC: 12,
  callerModelDryThresholdMm: 665,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/trewartha-classifier",
  title: "Trewartha Climate Classifier",
  description:
    "Trewartha main thermal groups using the Patton dry threshold 10(2.3T−0.64Ps+41), with Ps the summer precipitation percentage. Requires twelve homogeneous monthly normals and explicit hemisphere. Does not implement subclasses, establish mapped climate identity or predict future climate.",
  inputs: inputFields,
  outputs: [
    {
      id: "trewarthaThermalGroup",
      label: "Trewartha thermal group",
      kind: "string",
    },
    { id: "monthsAtLeastTenC", label: "Months at least ten c", kind: "number" },
    {
      id: "callerModelDryThresholdMm",
      label: "Caller model dry threshold mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyTemperatureC: value.monthlyTemperatureC as readonly number[],
      monthlyPrecipitationMm: value.monthlyPrecipitationMm as readonly number[],
      northernHemisphere: value.northernHemisphere as boolean,
    }),
});
export const run = tool.execute;
export default tool;
