import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualObjectDistanceMeters: number;
  readonly actualImageDistanceMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualObjectDistanceMeters",
    label: "Actual object distance meters",
    kind: "number",
  },
  {
    id: "actualImageDistanceMeters",
    label: "Actual image distance meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (
    input.actualObjectDistanceMeters === 0 ||
    input.actualImageDistanceMeters === 0
  )
    simpleError("distances", "Nonzero signed distances.");
  if (
    1 / input.actualObjectDistanceMeters +
      1 / input.actualImageDistanceMeters ===
    0
  )
    simpleError("focal", "Finite focal length required.");
  return {
    value:
      1 /
      (1 / input.actualObjectDistanceMeters +
        1 / input.actualImageDistanceMeters),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualObjectDistanceMeters: 2, actualImageDistanceMeters: 1 },
  output: { result: { value: 0.6666666666666666 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/lens-focal-length",
  title: "Lens Focal Length Calculator",
  description:
    "Ideal thin lens signed focal length from actual signed object/image distances, nonzero denominators, real/virtual sign convention stated externally. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
