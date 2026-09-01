import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedDesignValveDropsKpa: readonly number[];
  readonly observedRemainingCircuitDropsKpa: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedValveAuthorityFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDesignValveDropsKpa",
    label: "Observed design valve drops kpa",
    kind: "numberList",
  },
  {
    id: "observedRemainingCircuitDropsKpa",
    label: "Observed remaining circuit drops kpa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDesignValveDropsKpa.forEach((v) =>
    nonnegative(v, "observedDesignValveDropsKpa"),
  );
  input.observedRemainingCircuitDropsKpa.forEach((v) =>
    nonnegative(v, "observedRemainingCircuitDropsKpa"),
  );
  aligned(
    input.observedDesignValveDropsKpa,
    input.observedRemainingCircuitDropsKpa,
    "observedDesignValveDropsKpa",
  );
  return {
    observedValveAuthorityFractions: input.observedDesignValveDropsKpa.map(
      (v, i) => {
        const total = v + input.observedRemainingCircuitDropsKpa[i];
        positive(total, "circuitDrop");
        return v / total;
      },
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDesignValveDropsKpa: [10, 20],
  observedRemainingCircuitDropsKpa: [30, 20],
} satisfies Input;
export const exampleOutput = {
  observedValveAuthorityFractions: [0.25, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/control-valve-authority",
  title: "Plumbing Control Valve Authority Calculator",
  description:
    "Audit actual matched design-flow valve/circuit pressure budget as authority, not K or cavitation index and no universal controllability threshold.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedValveAuthorityFractions",
      label: "Observed valve authority fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDesignValveDropsKpa:
        value.observedDesignValveDropsKpa as readonly number[],
      observedRemainingCircuitDropsKpa:
        value.observedRemainingCircuitDropsKpa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
