import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly massKg: number;
  readonly speedMPerS: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "massKg", label: "Mass kg", kind: "number" },
  { id: "speedMPerS", label: "Speed m per s", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.massKg, "mass");
  nonnegative(i.speedMPerS, "speed");
  return { kineticJoules: (i.massKg * i.speedMPerS ** 2) / 2 };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { massKg: 2, speedMPerS: 10 },
  output: { result: { kineticJoules: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/ballistic-energy-from-mass",
  title: "Ballistic Energy From Mass Calculator",
  description:
    "Nonrelativistic kinetic energy of an observed volcanic projectile, not ejection probability or impact safety.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { kineticJoules: { type: "number" } },
        required: ["kineticJoules"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
