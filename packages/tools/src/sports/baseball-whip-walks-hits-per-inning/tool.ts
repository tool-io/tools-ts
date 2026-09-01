import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedWalksAllowed: number;
  readonly observedHitsAllowed: number;
  readonly observedOutsRecorded: number;
}>;
export type Output = Readonly<{ readonly walksHitsPerInning: number }>;
const inputFields = [
  {
    id: "observedWalksAllowed",
    label: "Observed walks allowed",
    kind: "number",
  },
  { id: "observedHitsAllowed", label: "Observed hits allowed", kind: "number" },
  {
    id: "observedOutsRecorded",
    label: "Observed outs recorded",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedWalksAllowed, "walks", 0, 1000000);
  bounded(input.observedHitsAllowed, "hits", 0, 1000000);
  bounded(input.observedOutsRecorded, "outs", 1, 1000000);
  return {
    walksHitsPerInning:
      (3 * (input.observedWalksAllowed + input.observedHitsAllowed)) /
      input.observedOutsRecorded,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWalksAllowed: 2,
  observedHitsAllowed: 4,
  observedOutsRecorded: 18,
} satisfies Input;
export const exampleOutput = { walksHitsPerInning: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/baseball-whip-walks-hits-per-inning",
  title: "WHIP Walks+Hits Per Inning",
  description:
    "Baseball WHIP from actual walks/hits and integer recorded outs; not ERA, opponent OBP or decimal inning notation.",
  inputs: inputFields,
  outputs: [
    {
      id: "walksHitsPerInning",
      label: "Walks hits per inning",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWalksAllowed: value.observedWalksAllowed as number,
      observedHitsAllowed: value.observedHitsAllowed as number,
      observedOutsRecorded: value.observedOutsRecorded as number,
    }),
});
export const run = tool.execute;
export default tool;
