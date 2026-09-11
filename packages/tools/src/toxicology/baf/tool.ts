import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualBiotaConcentrationSameMassBasis: number;
  readonly matchedAmbientEnvironmentalConcentrationSameMassBasis: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBiotaConcentrationSameMassBasis",
    label: "Actual biota concentration same mass basis",
    kind: "number",
  },
  {
    id: "matchedAmbientEnvironmentalConcentrationSameMassBasis",
    label: "Matched ambient environmental concentration same mass basis",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualBiotaConcentrationSameMassBasis, "numerator");
  positive(
    input.matchedAmbientEnvironmentalConcentrationSameMassBasis,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.actualBiotaConcentrationSameMassBasis) /
      input.matchedAmbientEnvironmentalConcentrationSameMassBasis,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualBiotaConcentrationSameMassBasis: 2,
    matchedAmbientEnvironmentalConcentrationSameMassBasis: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/baf",
  title: "Bioaccumulation Factor Calculator",
  description:
    "Actual environmental bioaccumulation concentration ratio, including whatever independently established pathways occurred; not a kinetic uptake/elimination BCFmodel or lipid-normalized predator/prey BMF. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
