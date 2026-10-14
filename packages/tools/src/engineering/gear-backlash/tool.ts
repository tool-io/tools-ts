import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCircumferentialBacklashMeters: number;
  readonly actualPitchRadiusMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualCircumferentialBacklashMeters",
    label: "Actual circumferential backlash meters",
    kind: "number",
  },
  {
    id: "actualPitchRadiusMeters",
    label: "Actual pitch radius meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualCircumferentialBacklashMeters,
    "actualCircumferentialBacklashMeters",
  );
  positive(input.actualPitchRadiusMeters, "actualPitchRadiusMeters");
  return {
    value:
      input.actualCircumferentialBacklashMeters / input.actualPitchRadiusMeters,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCircumferentialBacklashMeters: 1, actualPitchRadiusMeters: 2 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/gear-backlash",
  title: "Gear Backlash Calculator",
  description:
    "Actual tangential backlash/pitch radius angular backlash in radians, small angle measured convention; not a prescribed tolerance. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
