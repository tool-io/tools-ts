import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{ readonly distanceParsecs: number }>;
export type Output = Readonly<{ readonly distanceModulus: number }>;
const inputFields = [
  { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.distanceParsecs, "distanceParsecs");
  return { distanceModulus: 5 * Math.log10(input.distanceParsecs) - 5 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { distanceParsecs: 100 } satisfies Input;
export const exampleOutput = { distanceModulus: 5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/distance-modulus-parsecs",
  title: "Distance Modulus Parsecs Calculator",
  description:
    "Geometric distance modulus 5 log 10(dpc)−5 without extinction. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "distanceModulus", label: "Distance modulus", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ distanceParsecs: value.distanceParsecs as number }),
});
export const run = tool.execute;
export default tool;
