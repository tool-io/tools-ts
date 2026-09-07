import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  extrema,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTunnelBiasV: readonly number[];
  readonly observedBranchCurrentAmps: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedTunnelValleyCurrentAmps: number;
  readonly observedTunnelValleyBiasVoltages: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTunnelBiasV",
    label: "Observed tunnel bias v",
    kind: "numberList",
  },
  {
    id: "observedBranchCurrentAmps",
    label: "Observed branch current amps",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBranchCurrentAmps.forEach((v) =>
    nonnegative(v, "observedBranchCurrentAmps"),
  );
  const result = extrema(
    input.observedTunnelBiasV,
    input.observedBranchCurrentAmps,
    false,
  );
  return {
    observedTunnelValleyCurrentAmps: result.value,
    observedTunnelValleyBiasVoltages: result.coordinates,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTunnelBiasV: [0, 1, 2],
  observedBranchCurrentAmps: [1, 3, 2],
} satisfies Input;
export const exampleOutput = {
  observedTunnelValleyCurrentAmps: 1,
  observedTunnelValleyBiasVoltages: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/tunnel-diode-valley-current",
  title: "Semiconductor Tunnel Diode Valley Current Calculator",
  description:
    "Extract actual independently isolated tunnel-diode valley branch extrema and all tied bias positions; no peak-to-valley scalar ratio, global branch isolation assumption or bias operation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTunnelValleyCurrentAmps",
      label: "Observed tunnel valley current amps",
      kind: "number",
    },
    {
      id: "observedTunnelValleyBiasVoltages",
      label: "Observed tunnel valley bias voltages",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTunnelBiasV: value.observedTunnelBiasV as readonly number[],
      observedBranchCurrentAmps:
        value.observedBranchCurrentAmps as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
