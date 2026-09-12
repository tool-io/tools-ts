import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualBoilerHorsepower: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBoilerHorsepower",
    label: "Actual boiler horsepower",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualBoilerHorsepower, "actualBoilerHorsepower");
  return { value: 33475 * input.actualBoilerHorsepower };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualBoilerHorsepower: 2 },
  output: { result: { value: 66950 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/steam-boiler-horsepower-to-btu",
  title: "Plumbing Steam Boiler Horsepower To Btu Calculator",
  description:
    "Declared boiler horsepower conversion1BHP=33475BtuIT/hour, not mechanical horsepower2544Btu/h or actual thermal efficiency. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
