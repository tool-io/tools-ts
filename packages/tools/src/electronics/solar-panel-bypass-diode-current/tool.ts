import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualSeriesStringCurrentAmps: number;
  readonly actualShadedSubstringForwardCurrentAmps: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualSeriesStringCurrentAmps",
    label: "Actual series string current amps",
    kind: "number",
  },
  {
    id: "actualShadedSubstringForwardCurrentAmps",
    label: "Actual shaded substring forward current amps",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualSeriesStringCurrentAmps,
    "actualSeriesStringCurrentAmps",
  );
  nonnegative(
    input.actualShadedSubstringForwardCurrentAmps,
    "actualShadedSubstringForwardCurrentAmps",
  );
  return {
    value:
      input.actualSeriesStringCurrentAmps -
      input.actualShadedSubstringForwardCurrentAmps,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSeriesStringCurrentAmps: 5,
    actualShadedSubstringForwardCurrentAmps: 3,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/solar-panel-bypass-diode-current",
  title: "Solar Panel Bypass Diode Current Calculator",
  description:
    "Signed measured branch current conservation at conducting bypass diode Istring\u2212Isubstring, not select diodeampacity/thermal ratings or infer shading from irradiancealone. Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
