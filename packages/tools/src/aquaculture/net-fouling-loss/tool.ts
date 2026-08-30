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
  readonly cleanOpenAreaFractions: readonly number[];
  readonly fouledOpenAreaFractions: readonly number[];
  readonly panelAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly cleanEffectiveOpenAreaM2: number;
  readonly fouledEffectiveOpenAreaM2: number;
  readonly relativeOpenAreaLossFraction: number;
}>;
const inputFields = [
  {
    id: "cleanOpenAreaFractions",
    label: "Clean open area fractions",
    kind: "numberList",
  },
  {
    id: "fouledOpenAreaFractions",
    label: "Fouled open area fractions",
    kind: "numberList",
  },
  { id: "panelAreasM2", label: "Panel areas m2", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.panelAreasM2.forEach((v) => positive(v, "panelAreasM2"));
  input.cleanOpenAreaFractions.forEach((v) =>
    positive(v, "cleanOpenAreaFractions"),
  );
  input.cleanOpenAreaFractions.forEach((v) =>
    fraction(v, "cleanOpenAreaFractions"),
  );
  input.fouledOpenAreaFractions.forEach((v) =>
    fraction(v, "fouledOpenAreaFractions"),
  );
  aligned(input.panelAreasM2, input.cleanOpenAreaFractions, "panelAreasM2");
  aligned(input.panelAreasM2, input.fouledOpenAreaFractions, "panelAreasM2");
  if (
    input.fouledOpenAreaFractions.some(
      (v, i) => v > input.cleanOpenAreaFractions[i],
    )
  )
    simpleError(
      "fouledOpenAreaFractions",
      "Fouled openness cannot exceed matched clean openness.",
    );
  const cleanEffectiveOpenAreaM2 = input.panelAreasM2.reduce(
      (s, v, i) => s + v * input.cleanOpenAreaFractions[i],
      0,
    ),
    fouledEffectiveOpenAreaM2 = input.panelAreasM2.reduce(
      (s, v, i) => s + v * input.fouledOpenAreaFractions[i],
      0,
    );
  return {
    cleanEffectiveOpenAreaM2,
    fouledEffectiveOpenAreaM2,
    relativeOpenAreaLossFraction:
      1 - fouledEffectiveOpenAreaM2 / cleanEffectiveOpenAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cleanOpenAreaFractions: [0.8, 0.6],
  fouledOpenAreaFractions: [0.4, 0.3],
  panelAreasM2: [10, 20],
} satisfies Input;
export const exampleOutput = {
  cleanEffectiveOpenAreaM2: 20,
  fouledEffectiveOpenAreaM2: 10,
  relativeOpenAreaLossFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/net-fouling-loss",
  title: "Net Fouling Loss",
  description:
    "Measure area-weighted net opening loss from panel porosity measurements; no hydraulic flow or drag change is inferred merely from loss of open area.",
  inputs: inputFields,
  outputs: [
    {
      id: "cleanEffectiveOpenAreaM2",
      label: "Clean effective open area m2",
      kind: "number",
    },
    {
      id: "fouledEffectiveOpenAreaM2",
      label: "Fouled effective open area m2",
      kind: "number",
    },
    {
      id: "relativeOpenAreaLossFraction",
      label: "Relative open area loss fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cleanOpenAreaFractions: value.cleanOpenAreaFractions as readonly number[],
      fouledOpenAreaFractions:
        value.fouledOpenAreaFractions as readonly number[],
      panelAreasM2: value.panelAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
