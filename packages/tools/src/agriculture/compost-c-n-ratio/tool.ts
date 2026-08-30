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
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly componentWetMassesKg: readonly number[];
  readonly componentDryMatterFractions: readonly number[];
  readonly dryCarbonMassFractions: readonly number[];
  readonly dryNitrogenMassFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalDeclaredCarbonKg: number;
  readonly totalDeclaredNitrogenKg: number;
  readonly mixtureCarbonNitrogenMassRatio: number;
}>;
const inputFields = [
  {
    id: "componentWetMassesKg",
    label: "Component wet masses kg",
    kind: "numberList",
  },
  {
    id: "componentDryMatterFractions",
    label: "Component dry matter fractions",
    kind: "numberList",
  },
  {
    id: "dryCarbonMassFractions",
    label: "Dry carbon mass fractions",
    kind: "numberList",
  },
  {
    id: "dryNitrogenMassFractions",
    label: "Dry nitrogen mass fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.componentWetMassesKg.forEach((v) =>
    nonnegative(v, "componentWetMassesKg"),
  );
  input.componentDryMatterFractions.forEach((v) =>
    fraction(v, "componentDryMatterFractions"),
  );
  input.dryCarbonMassFractions.forEach((v) =>
    fraction(v, "dryCarbonMassFractions"),
  );
  input.dryNitrogenMassFractions.forEach((v) =>
    fraction(v, "dryNitrogenMassFractions"),
  );
  aligned(
    input.componentWetMassesKg,
    input.componentDryMatterFractions,
    "componentWetMassesKg",
  );
  aligned(
    input.componentWetMassesKg,
    input.dryCarbonMassFractions,
    "componentWetMassesKg",
  );
  aligned(
    input.componentWetMassesKg,
    input.dryNitrogenMassFractions,
    "componentWetMassesKg",
  );
  if (
    input.dryCarbonMassFractions.some(
      (v, i) => v + input.dryNitrogenMassFractions[i] > 1,
    )
  )
    simpleError(
      "composition",
      "Independent carbon+nitrogen mass cannot exceed component dry mass.",
    );
  const totalDeclaredCarbonKg = input.componentWetMassesKg.reduce(
      (s, v, i) =>
        s +
        v *
          input.componentDryMatterFractions[i] *
          input.dryCarbonMassFractions[i],
      0,
    ),
    totalDeclaredNitrogenKg = positive(
      input.componentWetMassesKg.reduce(
        (s, v, i) =>
          s +
          v *
            input.componentDryMatterFractions[i] *
            input.dryNitrogenMassFractions[i],
        0,
      ),
      "nitrogen",
    );
  return {
    totalDeclaredCarbonKg,
    totalDeclaredNitrogenKg,
    mixtureCarbonNitrogenMassRatio:
      totalDeclaredCarbonKg / totalDeclaredNitrogenKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentWetMassesKg: [10, 20],
  componentDryMatterFractions: [0.5, 0.25],
  dryCarbonMassFractions: [0.5, 0.4],
  dryNitrogenMassFractions: [0.05, 0.1],
} satisfies Input;
export const exampleOutput = {
  totalDeclaredCarbonKg: 4.5,
  totalDeclaredNitrogenKg: 0.75,
  mixtureCarbonNitrogenMassRatio: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/compost-c-n-ratio",
  title: "Agriculture Compost C N Ratio",
  description:
    "Conserve dry carbon/nitrogen across wet compost components to a mixture **mass** C/N, not mean component ratios or atomic bone-collagen C/N; no microbial adequacy or compost recipe.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalDeclaredCarbonKg",
      label: "Total declared carbon kg",
      kind: "number",
    },
    {
      id: "totalDeclaredNitrogenKg",
      label: "Total declared nitrogen kg",
      kind: "number",
    },
    {
      id: "mixtureCarbonNitrogenMassRatio",
      label: "Mixture carbon nitrogen mass ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentWetMassesKg: value.componentWetMassesKg as readonly number[],
      componentDryMatterFractions:
        value.componentDryMatterFractions as readonly number[],
      dryCarbonMassFractions: value.dryCarbonMassFractions as readonly number[],
      dryNitrogenMassFractions:
        value.dryNitrogenMassFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
