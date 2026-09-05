import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldWidth: number;
  readonly fieldHeight: number;
  readonly verticalArmWidth: number;
  readonly horizontalArmWidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fieldWidth", label: "Field width", kind: "number" },
  { id: "fieldHeight", label: "Field height", kind: "number" },
  { id: "verticalArmWidth", label: "Vertical arm width", kind: "number" },
  { id: "horizontalArmWidth", label: "Horizontal arm width", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.fieldWidth, "fieldWidth");
  positive(input.fieldHeight, "fieldHeight");
  positive(input.verticalArmWidth, "verticalArmWidth");
  positive(input.horizontalArmWidth, "horizontalArmWidth");
  if (
    input.verticalArmWidth > input.fieldWidth ||
    input.horizontalArmWidth > input.fieldHeight
  )
    simpleError("arms", "Arms inside explicit field envelope.");
  return {
    verticalArmFraction: input.verticalArmWidth / input.fieldWidth,
    horizontalArmFraction: input.horizontalArmWidth / input.fieldHeight,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    fieldWidth: 100,
    fieldHeight: 120,
    verticalArmWidth: 20,
    horizontalArmWidth: 24,
  },
  output: { result: { verticalArmFraction: 0.2, horizontalArmFraction: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/cross-arm-width-proportion",
  title: "Cross Arm Width Proportion Calculator",
  description:
    "Cross arm widths use their respective perpendicular envelope dimensions, not one width denominator for both.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
