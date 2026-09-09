import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyQualifiedFwaveLatenciesMs: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyQualifiedFwaveLatenciesMs",
    label: "Independently qualified fwave latencies ms",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyQualifiedFwaveLatenciesMs.length)
    simpleError("waves", "Nonempty independently qualified responses.");
  input.independentlyQualifiedFwaveLatenciesMs.forEach((v) =>
    nonnegative(v, "latency"),
  );
  const hi = Math.max(...input.independentlyQualifiedFwaveLatenciesMs),
    lo = Math.min(...input.independentlyQualifiedFwaveLatenciesMs);
  return {
    observedFwaveChronodispersionMs: hi - lo,
    observedMinimumFwaveLatencyMs: lo,
    observedMaximumFwaveLatencyMs: hi,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyQualifiedFwaveLatenciesMs: [20, 22, 25] },
  output: {
    result: {
      observedFwaveChronodispersionMs: 5,
      observedMinimumFwaveLatencyMs: 20,
      observedMaximumFwaveLatencyMs: 25,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/f-wave-chronodispersion",
  title: "F-Wave Chronodispersion Calculator",
  description:
    "Range of actual independently qualified F-wave repeat latencies, not nerve velocity, continuous dispersion or a universal normal threshold.",
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
