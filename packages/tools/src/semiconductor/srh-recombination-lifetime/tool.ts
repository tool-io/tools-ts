import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualExcessCarrierDensity: number;
  readonly independentlySeparatedSrhRecombinationRate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualExcessCarrierDensity",
    label: "Actual excess carrier density",
    kind: "number",
  },
  {
    id: "independentlySeparatedSrhRecombinationRate",
    label: "Independently separated srh recombination rate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualExcessCarrierDensity, "numerator");
  positive(input.independentlySeparatedSrhRecombinationRate, "denominator");
  return {
    observedRatio:
      (1 * input.actualExcessCarrierDensity) /
      input.independentlySeparatedSrhRecombinationRate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualExcessCarrierDensity: 2,
    independentlySeparatedSrhRecombinationRate: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/srh-recombination-lifetime",
  title: "Semiconductor Srh Recombination Lifetime Calculator",
  description:
    "Actual steady excess-carrier/SRH-rate effective lifetime with compatible density and density-per-second; not microscopic trap capture lifetimes or generic total recombination. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
