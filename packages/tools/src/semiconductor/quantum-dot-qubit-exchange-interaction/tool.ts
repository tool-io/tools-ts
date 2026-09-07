import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerHubbardTunnelEnergy: readonly number[];
  readonly callerHubbardOnsiteEnergy: readonly number[];
}>;
export type Output = Readonly<{
  readonly approximateAntiferromagneticExchangeEnergy: readonly number[];
}>;
const inputFields = [
  {
    id: "callerHubbardTunnelEnergy",
    label: "Caller hubbard tunnel energy",
    kind: "numberList",
  },
  {
    id: "callerHubbardOnsiteEnergy",
    label: "Caller hubbard onsite energy",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerHubbardTunnelEnergy.forEach((v) =>
    positive(v, "callerHubbardTunnelEnergy"),
  );
  input.callerHubbardOnsiteEnergy.forEach((v) =>
    positive(v, "callerHubbardOnsiteEnergy"),
  );
  aligned(
    input.callerHubbardTunnelEnergy,
    input.callerHubbardOnsiteEnergy,
    "callerHubbardTunnelEnergy",
  );
  if (
    input.callerHubbardTunnelEnergy.some(
      (v, i) => v / input.callerHubbardOnsiteEnergy[i] > 0.1,
    )
  )
    simpleError("Hubbard", "Explicit weak-tunneling t/U≤.1 branch required.");
  return {
    approximateAntiferromagneticExchangeEnergy:
      input.callerHubbardTunnelEnergy.map(
        (v, i) => (4 * v * v) / input.callerHubbardOnsiteEnergy[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerHubbardTunnelEnergy: [1, 2],
  callerHubbardOnsiteEnergy: [10, 20],
} satisfies Input;
export const exampleOutput = {
  approximateAntiferromagneticExchangeEnergy: [0.4, 0.8],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/quantum-dot-qubit-exchange-interaction",
  title: "Semiconductor Quantum Dot Qubit Exchange Interaction Calculator",
  description:
    "Named weak-tunneling two-site Hubbard exchange J≈4t²/U at zero detuning; not general biased-dot exchange Hamiltonian or spin gate timing.",
  inputs: inputFields,
  outputs: [
    {
      id: "approximateAntiferromagneticExchangeEnergy",
      label: "Approximate antiferromagnetic exchange energy",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerHubbardTunnelEnergy:
        value.callerHubbardTunnelEnergy as readonly number[],
      callerHubbardOnsiteEnergy:
        value.callerHubbardOnsiteEnergy as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
