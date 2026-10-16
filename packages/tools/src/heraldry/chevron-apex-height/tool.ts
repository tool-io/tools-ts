import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  rad,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly halfSpan: number;
  readonly armAngleDegrees: number;
  readonly baseY: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "halfSpan", label: "Half span", kind: "number" },
  { id: "armAngleDegrees", label: "Arm angle degrees", kind: "number" },
  { id: "baseY", label: "Base y", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.halfSpan, "halfSpan");
  if (input.armAngleDegrees < 0 || input.armAngleDegrees >= 90)
    simpleError("angle", "0–less-than 90 degrees.");
  const rise = input.halfSpan * Math.tan(rad(input.armAngleDegrees));
  return { apexY: input.baseY - rise, apexRise: rise };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { halfSpan: 30, armAngleDegrees: 45, baseY: 80 },
  output: { result: { apexY: 50, apexRise: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/chevron-apex-height",
  title: "Chevron Apex Height Calculator",
  description:
    "Symmetric ideal chevron apex from measured half-span and angle, top-left y-down coordinates.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { apexY: { type: "number" }, apexRise: { type: "number" } },
        required: ["apexY", "apexRise"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
