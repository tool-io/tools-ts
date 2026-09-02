import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch41-shared.js";
export type Input = Readonly<{ readonly massKg: number }>;
export type Output = Readonly<{ readonly schwarzschildRadiusMeters: number }>;
const inputFields = [
  { id: "massKg", label: "Mass kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.massKg, "massKg");
  return {
    schwarzschildRadiusMeters: (2 * 6.6743e-11 * input.massKg) / 299792458 ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { massKg: 1e30 } satisfies Input;
export const exampleOutput = {
  schwarzschildRadiusMeters: 1485.232053823733,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/schwarzschild-radius-mass",
  title: "Schwarzschild Radius From Mass",
  description:
    "Nonrotating uncharged Schwarzschild 2 GM/c²radius; not general spinning horizon radius. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "schwarzschildRadiusMeters",
      label: "Schwarzschild radius meters",
      kind: "number",
    },
  ],
  calculate: (value) => calculate({ massKg: value.massKg as number }),
});
export const run = tool.execute;
export default tool;
