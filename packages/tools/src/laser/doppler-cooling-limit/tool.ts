import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly naturalLinewidthHertz: number;
}>;
export type Output = Readonly<{
  readonly dopplerLimitKelvin: number;
  readonly dopplerLimitMicrokelvin: number;
}>;

export const calculate = (input: Input): Output => {
  const h = 6.62607015e-34,
    k = 1.380649e-23;
  const dopplerLimitKelvin = (h * input.naturalLinewidthHertz) / (2 * k);
  return {
    dopplerLimitKelvin,
    dopplerLimitMicrokelvin: dopplerLimitKelvin * 1e6,
  };
};

export const exampleInput = { naturalLinewidthHertz: 10000000 } satisfies Input;
export const exampleOutput = {
  dopplerLimitKelvin: 0.00023996215366831104,
  dopplerLimitMicrokelvin: 239.96215366831103,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      naturalLinewidthHertz: input.naturalLinewidthHertz as number,
    }),
  description:
    "Calculate the two-level Doppler cooling limit from natural linewidth in hertz.",
  id: "laser/doppler-cooling-limit",
  inputs: [
    {
      id: "naturalLinewidthHertz",
      label: "Natural linewidth",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "dopplerLimitKelvin",
      label: "Doppler cooling limit",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      id: "dopplerLimitMicrokelvin",
      label: "Doppler cooling limit",
      kind: "number",
      minimum: 0,
      unit: "µK",
    },
  ],
  title: "Doppler Cooling Limit",
});

export const run = tool.execute;
export default tool;
