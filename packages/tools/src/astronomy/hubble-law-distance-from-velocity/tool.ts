import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly peculiarCorrectedRecessionKmPerSecond: number;
  readonly hubbleKmPerSecondPerMpc: number;
}>;
export type Output = Readonly<{ readonly linearHubbleDistanceMpc: number }>;
const inputFields = [
  {
    id: "peculiarCorrectedRecessionKmPerSecond",
    label: "Peculiar corrected recession km per second",
    kind: "number",
  },
  {
    id: "hubbleKmPerSecondPerMpc",
    label: "Hubble km per second per mpc",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.hubbleKmPerSecondPerMpc, "hubbleKmPerSecondPerMpc");
  return {
    linearHubbleDistanceMpc:
      input.peculiarCorrectedRecessionKmPerSecond /
      input.hubbleKmPerSecondPerMpc,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  peculiarCorrectedRecessionKmPerSecond: 700,
  hubbleKmPerSecondPerMpc: 70,
} satisfies Input;
export const exampleOutput = { linearHubbleDistanceMpc: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/hubble-law-distance-from-velocity",
  title: "Hubble Law Distance From Velocity",
  description:
    "Low-redshift linear Hubble distance with independently corrected peculiar motion and caller H0; signed velocity/distance retained, not cosmological inference for largez. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "linearHubbleDistanceMpc",
      label: "Linear hubble distance mpc",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      peculiarCorrectedRecessionKmPerSecond:
        value.peculiarCorrectedRecessionKmPerSecond as number,
      hubbleKmPerSecondPerMpc: value.hubbleKmPerSecondPerMpc as number,
    }),
});
export const run = tool.execute;
export default tool;
