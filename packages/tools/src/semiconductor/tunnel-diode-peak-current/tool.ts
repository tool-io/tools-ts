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
  readonly observedTunnelPeakCurrentAmps: number;
  readonly observedTunnelPeakBiasVoltages: readonly number[];
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
    true,
  );
  return {
    observedTunnelPeakCurrentAmps: result.value,
    observedTunnelPeakBiasVoltages: result.coordinates,
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
  observedTunnelPeakCurrentAmps: 3,
  observedTunnelPeakBiasVoltages: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/tunnel-diode-peak-current",
  title: "Semiconductor Tunnel Diode Peak Current Calculator",
  description:
    "Extract actual independently isolated tunnel-diode peak branch extrema and all tied bias positions; no peak-to-valley scalar ratio, global branch isolation assumption or bias operation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTunnelPeakCurrentAmps",
      label: "Observed tunnel peak current amps",
      kind: "number",
    },
    {
      id: "observedTunnelPeakBiasVoltages",
      label: "Observed tunnel peak bias voltages",
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
