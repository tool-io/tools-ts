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
  literal,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedPetiolePotassiumPercent: readonly number[];
  readonly callerPotassiumReportBasisTokens: readonly string[];
  readonly callerK2oToElementalKMassFraction: number;
  readonly callerElementalKBandPercent: readonly number[];
}>;
export type Output = Readonly<{
  readonly elementalPotassiumPercent: readonly number[];
  readonly petioleSamplesOutsideCallerElementalKBand: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPetiolePotassiumPercent",
    label: "Observed petiole potassium percent",
    kind: "numberList",
  },
  {
    id: "callerPotassiumReportBasisTokens",
    label: "Caller potassium report basis tokens",
    kind: "stringList",
  },
  {
    id: "callerK2oToElementalKMassFraction",
    label: "Caller k2o to elemental k mass fraction",
    kind: "number",
  },
  {
    id: "callerElementalKBandPercent",
    label: "Caller elemental k band percent",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerK2oToElementalKMassFraction,
    "callerK2oToElementalKMassFraction",
  );
  input.observedPetiolePotassiumPercent.forEach((v) =>
    nonnegative(v, "observedPetiolePotassiumPercent"),
  );
  input.callerElementalKBandPercent.forEach((v) =>
    nonnegative(v, "callerElementalKBandPercent"),
  );
  fraction(
    input.callerK2oToElementalKMassFraction,
    "callerK2oToElementalKMassFraction",
  );
  aligned(
    input.observedPetiolePotassiumPercent,
    input.callerPotassiumReportBasisTokens,
    "observedPetiolePotassiumPercent",
  );
  if (
    input.callerElementalKBandPercent.length !== 2 ||
    [
      ...input.observedPetiolePotassiumPercent,
      ...input.callerElementalKBandPercent,
    ].some((v) => v > 100)
  )
    simpleError(
      "assay",
      "Explicit elemental K percentage limits in [0,100] required.",
    );
  input.callerPotassiumReportBasisTokens.forEach((v) =>
    literal(v, ["K", "K2O"], "basis"),
  );
  const elemental = input.observedPetiolePotassiumPercent.map((v, i) =>
    input.callerPotassiumReportBasisTokens[i] === "K"
      ? v
      : v * input.callerK2oToElementalKMassFraction,
  );
  return {
    elementalPotassiumPercent: elemental,
    petioleSamplesOutsideCallerElementalKBand: elemental.flatMap((v, i) =>
      band(
        v,
        input.callerElementalKBandPercent[0],
        input.callerElementalKBandPercent[1],
      ) < 0
        ? [i]
        : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPetiolePotassiumPercent: [1, 2],
  callerPotassiumReportBasisTokens: ["K2O", "K"],
  callerK2oToElementalKMassFraction: 0.8,
  callerElementalKBandPercent: [0.9, 2.1],
} satisfies Input;
export const exampleOutput = {
  elementalPotassiumPercent: [0.8, 2],
  petioleSamplesOutsideCallerElementalKBand: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/petiole-potassium-sufficiency-lookup",
  title: "Petiole Potassium Sufficiency Lookup",
  description:
    "Audit actual petiole K/K2O reporting convention under independently justified conversion factor and caller elemental-K assay band; not nitrate conversion, total uptake or fertilizer sufficiency recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "elementalPotassiumPercent",
      label: "Elemental potassium percent",
      kind: "numberList",
    },
    {
      id: "petioleSamplesOutsideCallerElementalKBand",
      label: "Petiole samples outside caller elemental k band",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPetiolePotassiumPercent:
        value.observedPetiolePotassiumPercent as readonly number[],
      callerPotassiumReportBasisTokens:
        value.callerPotassiumReportBasisTokens as readonly string[],
      callerK2oToElementalKMassFraction:
        value.callerK2oToElementalKMassFraction as number,
      callerElementalKBandPercent:
        value.callerElementalKBandPercent as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
