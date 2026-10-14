import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualHorizontalTensionNewtons: number;
  readonly actualCableWeightPerActualLength: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualHorizontalTensionNewtons",
    label: "Actual horizontal tension new tons",
    kind: "number",
  },
  {
    id: "actualCableWeightPerActualLength",
    label: "Actual cable weight per actual length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.actualHorizontalTensionNewtons,
    "actualHorizontalTensionNewtons",
  );
  positive(
    input.actualCableWeightPerActualLength,
    "actualCableWeightPerActualLength",
  );
  return {
    value:
      input.actualHorizontalTensionNewtons /
      input.actualCableWeightPerActualLength,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualHorizontalTensionNewtons: 4,
    actualCableWeightPerActualLength: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/catenary-parameter",
  title: "Catenary Parameter Calculator",
  description:
    "Self weight catenary parameter a=H/w, intrinsic actual cable weight per actual arc length; not solve span/sag condition or select tension. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
