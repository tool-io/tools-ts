import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedSilageWetMassKg: readonly number[];
  readonly ovenDrySilageMatchedSamplesKg: readonly number[];
  readonly silageMatchedWetSamplesKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly inventoriedSilageDryMatterKg: number;
}>;
const inputFields = [
  {
    id: "observedSilageWetMassKg",
    label: "Observed silage wet mass kg",
    kind: "numberList",
  },
  {
    id: "ovenDrySilageMatchedSamplesKg",
    label: "Oven dry silage matched samples kg",
    kind: "numberList",
  },
  {
    id: "silageMatchedWetSamplesKg",
    label: "Silage matched wet samples kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.silageMatchedWetSamplesKg.forEach((v) =>
    positive(v, "silageMatchedWetSamplesKg"),
  );
  input.observedSilageWetMassKg.forEach((v) =>
    nonnegative(v, "observedSilageWetMassKg"),
  );
  input.ovenDrySilageMatchedSamplesKg.forEach((v) =>
    nonnegative(v, "ovenDrySilageMatchedSamplesKg"),
  );
  aligned(
    input.observedSilageWetMassKg,
    input.ovenDrySilageMatchedSamplesKg,
    "observedSilageWetMassKg",
  );
  aligned(
    input.observedSilageWetMassKg,
    input.silageMatchedWetSamplesKg,
    "observedSilageWetMassKg",
  );
  input.ovenDrySilageMatchedSamplesKg.forEach((v, i) => {
    if (v > input.silageMatchedWetSamplesKg[i])
      simpleError("samples", "Dry≤wet matched sample.");
  });
  return {
    inventoriedSilageDryMatterKg: sum(
      input.observedSilageWetMassKg.map(
        (v, i) =>
          (v * input.ovenDrySilageMatchedSamplesKg[i]) /
          input.silageMatchedWetSamplesKg[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSilageWetMassKg: [10, 20],
  ovenDrySilageMatchedSamplesKg: [1, 3],
  silageMatchedWetSamplesKg: [2, 5],
} satisfies Input;
export const exampleOutput = {
  inventoriedSilageDryMatterKg: 17,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/silage-dry-matter",
  title: "Agriculture Silage Dry Matter Calculator",
  description:
    "Separate actual silo lot inventory weighted by paired lot samples, not a generic single dry-matter percent conversion. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "inventoriedSilageDryMatterKg",
      label: "Inventoried silage dry matter kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSilageWetMassKg:
        value.observedSilageWetMassKg as readonly number[],
      ovenDrySilageMatchedSamplesKg:
        value.ovenDrySilageMatchedSamplesKg as readonly number[],
      silageMatchedWetSamplesKg:
        value.silageMatchedWetSamplesKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
