import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedUnstressedMatchedDrainAmps: readonly number[];
  readonly observedPostStressMatchedDrainAmps: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedCurrentCollapseFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedUnstressedMatchedDrainAmps",
    label: "Observed unstressed matched drain amps",
    kind: "numberList",
  },
  {
    id: "observedPostStressMatchedDrainAmps",
    label: "Observed post stress matched drain amps",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedUnstressedMatchedDrainAmps.forEach((v) =>
    positive(v, "observedUnstressedMatchedDrainAmps"),
  );
  input.observedPostStressMatchedDrainAmps.forEach((v) =>
    nonnegative(v, "observedPostStressMatchedDrainAmps"),
  );
  aligned(
    input.observedUnstressedMatchedDrainAmps,
    input.observedPostStressMatchedDrainAmps,
    "observedUnstressedMatchedDrainAmps",
  );
  return {
    signedCurrentCollapseFractions:
      input.observedPostStressMatchedDrainAmps.map(
        (v, i) => 1 - v / input.observedUnstressedMatchedDrainAmps[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUnstressedMatchedDrainAmps: [10, 20],
  observedPostStressMatchedDrainAmps: [8, 22],
} satisfies Input;
export const exampleOutput = {
  signedCurrentCollapseFractions: [0.2, -0.1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/gan-hemt-current-collapse",
  title: "Semiconductor Gan Hemt Current Collapse Calculator",
  description:
    "Audit actual same-bias GaN current-collapse observation relative to unstressed current, negative enhancement retained; not dynamic resistance ratio or inferred trap lifetime.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCurrentCollapseFractions",
      label: "Signed current collapse fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUnstressedMatchedDrainAmps:
        value.observedUnstressedMatchedDrainAmps as readonly number[],
      observedPostStressMatchedDrainAmps:
        value.observedPostStressMatchedDrainAmps as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
