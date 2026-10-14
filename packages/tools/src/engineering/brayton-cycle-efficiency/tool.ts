import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly pressureRatio: number;
  readonly heatCapacityRatio: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "pressureRatio", label: "Pressure ratio", kind: "number" },
  { id: "heatCapacityRatio", label: "Heat capacity ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.pressureRatio, "pressureRatio");
  positive(input.heatCapacityRatio, "heatCapacityRatio");
  if (input.pressureRatio < 1 || input.heatCapacityRatio <= 1)
    simpleError("cycle", "rp≥1,γ>1.");
  return {
    value:
      1 -
      1 /
        input.pressureRatio **
          ((input.heatCapacityRatio - 1) / input.heatCapacityRatio),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { pressureRatio: 4, heatCapacityRatio: 2 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/brayton-cycle-efficiency",
  title: "Brayton Cycle Efficiency Calculator",
  description:
    "Ideal air-standard Brayton efficiency1\u2212rp^\u2212((\u03b3\u22121)/\u03b3), constant\u03b3>1, rp\u22651; no actual component efficiencies or heat capacities invented. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
