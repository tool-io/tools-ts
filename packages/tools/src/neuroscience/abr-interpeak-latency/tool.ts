import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyIdentifiedWaveOneMs: number;
  readonly independentlyIdentifiedWaveThreeMs: number;
  readonly independentlyIdentifiedWaveFiveMs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyIdentifiedWaveOneMs",
    label: "Independently identified wave one ms",
    kind: "number",
  },
  {
    id: "independentlyIdentifiedWaveThreeMs",
    label: "Independently identified wave three ms",
    kind: "number",
  },
  {
    id: "independentlyIdentifiedWaveFiveMs",
    label: "Independently identified wave five ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyIdentifiedWaveOneMs < 0 ||
    input.independentlyIdentifiedWaveThreeMs <
      input.independentlyIdentifiedWaveOneMs ||
    input.independentlyIdentifiedWaveFiveMs <
      input.independentlyIdentifiedWaveThreeMs
  )
    simpleError(
      "peaks",
      "Independently identified chronological matched ABRpeaks.",
    );
  return {
    observedOneToThreeMs:
      input.independentlyIdentifiedWaveThreeMs -
      input.independentlyIdentifiedWaveOneMs,
    observedThreeToFiveMs:
      input.independentlyIdentifiedWaveFiveMs -
      input.independentlyIdentifiedWaveThreeMs,
    observedOneToFiveMs:
      input.independentlyIdentifiedWaveFiveMs -
      input.independentlyIdentifiedWaveOneMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyIdentifiedWaveOneMs: 1,
    independentlyIdentifiedWaveThreeMs: 3,
    independentlyIdentifiedWaveFiveMs: 5,
  },
  output: {
    result: {
      observedOneToThreeMs: 2,
      observedThreeToFiveMs: 2,
      observedOneToFiveMs: 4,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/abr-interpeak-latency",
  title: "ABR Interpeak Latency Calculator",
  description:
    "Actual independently identified chronological ABRwaveI/III/Vcomponent interpeak latencies. Component identification and same stimulus/acquisition essential; not automatically find peaks or diagnose conduction pathology.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
