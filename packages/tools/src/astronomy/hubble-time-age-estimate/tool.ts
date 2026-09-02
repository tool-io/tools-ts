import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{ readonly hubbleKmPerSecondPerMpc: number }>;
export type Output = Readonly<{ readonly hubbleTimeGyr: number }>;
const inputFields = [
  {
    id: "hubbleKmPerSecondPerMpc",
    label: "Hubble km per second per mpc",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.hubbleKmPerSecondPerMpc, "hubbleKmPerSecondPerMpc");
  return {
    hubbleTimeGyr:
      3.0856775814913673e19 /
      input.hubbleKmPerSecondPerMpc /
      (365.25 * 86400 * 1e9),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { hubbleKmPerSecondPerMpc: 70 } satisfies Input;
export const exampleOutput = {
  hubbleTimeGyr: 13.96846030972556,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/hubble-time-age-estimate",
  title: "Hubble Time Age Estimate",
  description:
    "1/H0 timescale in Julian Gyr, not actual cosmological age without expansion history. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [{ id: "hubbleTimeGyr", label: "Hubble time gyr", kind: "number" }],
  calculate: (value) =>
    calculate({
      hubbleKmPerSecondPerMpc: value.hubbleKmPerSecondPerMpc as number,
    }),
});
export const run = tool.execute;
export default tool;
