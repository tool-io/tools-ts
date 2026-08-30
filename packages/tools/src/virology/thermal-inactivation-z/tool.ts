import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly firstTemperatureC: number;
  readonly firstDecimalTimeMinutes: number;
  readonly secondTemperatureC: number;
  readonly secondDecimalTimeMinutes: number;
}>;
export type Output = Readonly<{
  readonly zValueC: number;
  readonly log10DTemperatureSlope: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.firstDecimalTimeMinutes, "firstDecimalTimeMinutes");
  positive(input.secondDecimalTimeMinutes, "secondDecimalTimeMinutes");
  if (input.firstTemperatureC === input.secondTemperatureC)
    simpleError("secondTemperatureC", "Distinct assay temperatures required.");
  const log10DTemperatureSlope =
    (Math.log10(input.secondDecimalTimeMinutes) -
      Math.log10(input.firstDecimalTimeMinutes)) /
    (input.secondTemperatureC - input.firstTemperatureC);
  if (log10DTemperatureSlope >= 0)
    simpleError(
      "secondDecimalTimeMinutes",
      "Decimal-reduction time must decrease as temperature increases.",
    );
  return { zValueC: -1 / log10DTemperatureSlope, log10DTemperatureSlope };
};
export const exampleInput = {
  firstTemperatureC: 60,
  firstDecimalTimeMinutes: 10,
  secondTemperatureC: 70,
  secondDecimalTimeMinutes: 1,
} satisfies Input;
export const exampleOutput = {
  zValueC: 10,
  log10DTemperatureSlope: -0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/thermal-inactivation-z",
  title: "Thermal Inactivation Z",
  description:
    "Infer a two-temperature thermal Z value from validated decimal-reduction times; extrapolation outside the measured range is not validated.",
  inputs: [
    { id: "firstTemperatureC", label: "First temperature c", kind: "number" },
    {
      id: "firstDecimalTimeMinutes",
      label: "First decimal time minutes",
      kind: "number",
    },
    { id: "secondTemperatureC", label: "Second temperature c", kind: "number" },
    {
      id: "secondDecimalTimeMinutes",
      label: "Second decimal time minutes",
      kind: "number",
    },
  ],
  outputs: [
    { id: "zValueC", label: "Z value c", kind: "number" },
    {
      id: "log10DTemperatureSlope",
      label: "Log 10 d temperature slope",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstTemperatureC: value.firstTemperatureC as number,
      firstDecimalTimeMinutes: value.firstDecimalTimeMinutes as number,
      secondTemperatureC: value.secondTemperatureC as number,
      secondDecimalTimeMinutes: value.secondDecimalTimeMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
