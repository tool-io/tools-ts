import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  sum,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedValleyBerryCurvaturesM2: readonly number[];
  readonly observedKSpaceCellAreasPerM2: readonly number[];
  readonly observedOccupationFractions: readonly number[];
  readonly callerConductivityPrefactorSiemens: number;
}>;
export type Output = Readonly<{
  readonly signedValleyHallConductivitySiemens: number;
}>;
const inputFields = [
  {
    id: "observedValleyBerryCurvaturesM2",
    label: "Observed valley berry curvatures m2",
    kind: "numberList",
  },
  {
    id: "observedKSpaceCellAreasPerM2",
    label: "Observed k space cell areas per m2",
    kind: "numberList",
  },
  {
    id: "observedOccupationFractions",
    label: "Observed occupation fractions",
    kind: "numberList",
  },
  {
    id: "callerConductivityPrefactorSiemens",
    label: "Caller conductivity prefactor siemens",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedKSpaceCellAreasPerM2.forEach((v) =>
    positive(v, "observedKSpaceCellAreasPerM2"),
  );
  positive(
    input.callerConductivityPrefactorSiemens,
    "callerConductivityPrefactorSiemens",
  );
  input.observedOccupationFractions.forEach((v) =>
    fraction(v, "observedOccupationFractions"),
  );
  aligned(
    input.observedValleyBerryCurvaturesM2,
    input.observedKSpaceCellAreasPerM2,
    "observedValleyBerryCurvaturesM2",
  );
  aligned(
    input.observedValleyBerryCurvaturesM2,
    input.observedOccupationFractions,
    "observedValleyBerryCurvaturesM2",
  );
  return {
    signedValleyHallConductivitySiemens:
      (input.callerConductivityPrefactorSiemens *
        sum(
          input.observedValleyBerryCurvaturesM2.map(
            (v, i) =>
              v *
              input.observedKSpaceCellAreasPerM2[i] *
              input.observedOccupationFractions[i],
          ),
        )) /
      (2 * Math.PI) ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedValleyBerryCurvaturesM2: [1, -2],
  observedKSpaceCellAreasPerM2: [2, 1],
  observedOccupationFractions: [1, 0.5],
  callerConductivityPrefactorSiemens: 1,
} satisfies Input;
export const exampleOutput = {
  signedValleyHallConductivitySiemens: 0.025330295910584444,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/valley-hall-conductivity",
  title: "Semiconductor Valley Hall Conductivity Calculator",
  description:
    "Quadrature of actual valley-restricted Berry curvature/k-space cells and occupations with caller signed convention/prefactor, not full topological Chern invariant or quantized conductivity claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedValleyHallConductivitySiemens",
      label: "Signed valley hall conductivity siemens",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedValleyBerryCurvaturesM2:
        value.observedValleyBerryCurvaturesM2 as readonly number[],
      observedKSpaceCellAreasPerM2:
        value.observedKSpaceCellAreasPerM2 as readonly number[],
      observedOccupationFractions:
        value.observedOccupationFractions as readonly number[],
      callerConductivityPrefactorSiemens:
        value.callerConductivityPrefactorSiemens as number,
    }),
});
export const run = tool.execute;
export default tool;
