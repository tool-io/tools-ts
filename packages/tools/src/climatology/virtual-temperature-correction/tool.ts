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
  fraction,
  aligned,
} from "../shared.js";

export type Input = Readonly<{
  readonly temperaturesK: readonly number[];
  readonly waterVaporSpecificMassFractions: readonly number[];
  readonly liquidWaterSpecificMassFractions: readonly number[];
  readonly dryToVaporGasConstantRatio: number;
}>;
export type Output = Readonly<{
  readonly virtualTemperaturesK: readonly number[];
}>;
const inputFields = [
  { id: "temperaturesK", label: "Temperatures k", kind: "numberList" },
  {
    id: "waterVaporSpecificMassFractions",
    label: "Water vapor specific mass fractions",
    kind: "numberList",
  },
  {
    id: "liquidWaterSpecificMassFractions",
    label: "Liquid water specific mass fractions",
    kind: "numberList",
  },
  {
    id: "dryToVaporGasConstantRatio",
    label: "Dry to vapor gas constant ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.temperaturesK.forEach((v) => positive(v, "temperaturesK"));
  positive(input.dryToVaporGasConstantRatio, "dryToVaporGasConstantRatio");
  input.waterVaporSpecificMassFractions.forEach((v) =>
    fraction(v, "waterVaporSpecificMassFractions"),
  );
  input.liquidWaterSpecificMassFractions.forEach((v) =>
    fraction(v, "liquidWaterSpecificMassFractions"),
  );
  aligned(
    input.temperaturesK,
    input.waterVaporSpecificMassFractions,
    "temperaturesK",
  );
  aligned(
    input.temperaturesK,
    input.liquidWaterSpecificMassFractions,
    "temperaturesK",
  );
  if (
    input.dryToVaporGasConstantRatio >= 1 ||
    input.waterVaporSpecificMassFractions.some(
      (q, i) => q + input.liquidWaterSpecificMassFractions[i] >= 1,
    )
  )
    simpleError(
      "composition",
      "Gas ratio below one and a nonzero dry-air specific-mass fraction required.",
    );
  return {
    virtualTemperaturesK: input.temperaturesK.map(
      (t, i) =>
        t *
        (1 +
          (1 / input.dryToVaporGasConstantRatio - 1) *
            input.waterVaporSpecificMassFractions[i] -
          input.liquidWaterSpecificMassFractions[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  temperaturesK: [300],
  waterVaporSpecificMassFractions: [0.01],
  liquidWaterSpecificMassFractions: [0.001],
  dryToVaporGasConstantRatio: 0.5,
} satisfies Input;
export const exampleOutput = { virtualTemperaturesK: [302.7] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/virtual-temperature-correction",
  title: "Virtual Temperature Correction",
  description:
    "Compute exact ideal moist-air virtual temperature with vapor and suspended-liquid specific mass fractions relative to total mixture; differs from vapor mixing-ratio approximations and excludes ice unless caller independently models it.",
  inputs: inputFields,
  outputs: [
    {
      id: "virtualTemperaturesK",
      label: "Virtual temperatures k",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      temperaturesK: value.temperaturesK as readonly number[],
      waterVaporSpecificMassFractions:
        value.waterVaporSpecificMassFractions as readonly number[],
      liquidWaterSpecificMassFractions:
        value.liquidWaterSpecificMassFractions as readonly number[],
      dryToVaporGasConstantRatio: value.dryToVaporGasConstantRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
