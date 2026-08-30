import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly cocoonInputKg: number;
  readonly cocoonInputMoistureFraction: number;
  readonly rawSilkOutputKg: number;
  readonly rawSilkMoistureFraction: number;
  readonly byproductDryMassKg: number;
}>;
export type Output = Readonly<{
  readonly asReceivedRawSilkRecoveryPercent: number;
  readonly dryBasisRawSilkRecoveryPercent: number;
  readonly unrecoveredDryInputKg: number;
}>;
const inputFields = [
  { id: "cocoonInputKg", label: "Cocoon input kg", kind: "number" },
  {
    id: "cocoonInputMoistureFraction",
    label: "Cocoon input moisture fraction",
    kind: "number",
  },
  { id: "rawSilkOutputKg", label: "Raw silk output kg", kind: "number" },
  {
    id: "rawSilkMoistureFraction",
    label: "Raw silk moisture fraction",
    kind: "number",
  },
  { id: "byproductDryMassKg", label: "Byproduct dry mass kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.cocoonInputKg, "cocoonInputKg");
  nonnegative(input.rawSilkOutputKg, "rawSilkOutputKg");
  nonnegative(input.byproductDryMassKg, "byproductDryMassKg");
  fraction(input.cocoonInputMoistureFraction, "cocoonInputMoistureFraction");
  fraction(input.rawSilkMoistureFraction, "rawSilkMoistureFraction");
  const dryInput = positive(
      input.cocoonInputKg * (1 - input.cocoonInputMoistureFraction),
      "cocoonInputMoistureFraction",
    ),
    dryOutput = input.rawSilkOutputKg * (1 - input.rawSilkMoistureFraction),
    unrecoveredDryInputKg = nonnegative(
      dryInput - dryOutput - input.byproductDryMassKg,
      "byproductDryMassKg",
    );
  return {
    asReceivedRawSilkRecoveryPercent:
      (100 * input.rawSilkOutputKg) / input.cocoonInputKg,
    dryBasisRawSilkRecoveryPercent: (100 * dryOutput) / dryInput,
    unrecoveredDryInputKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cocoonInputKg: 10,
  cocoonInputMoistureFraction: 0.5,
  rawSilkOutputKg: 2,
  rawSilkMoistureFraction: 0.1,
  byproductDryMassKg: 1,
} satisfies Input;
export const exampleOutput = {
  asReceivedRawSilkRecoveryPercent: 20,
  dryBasisRawSilkRecoveryPercent: 36,
  unrecoveredDryInputKg: 2.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/raw-silk-recovery-percent",
  title: "Raw Silk Recovery Percent",
  description:
    "Balance raw-silk recovery on wet/dry bases and retained dry byproducts; unrecovered includes non-silk material and is not automatically pure-silk loss.",
  inputs: inputFields,
  outputs: [
    {
      id: "asReceivedRawSilkRecoveryPercent",
      label: "As received raw silk recovery percent",
      kind: "number",
    },
    {
      id: "dryBasisRawSilkRecoveryPercent",
      label: "Dry basis raw silk recovery percent",
      kind: "number",
    },
    {
      id: "unrecoveredDryInputKg",
      label: "Unrecovered dry input kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cocoonInputKg: value.cocoonInputKg as number,
      cocoonInputMoistureFraction: value.cocoonInputMoistureFraction as number,
      rawSilkOutputKg: value.rawSilkOutputKg as number,
      rawSilkMoistureFraction: value.rawSilkMoistureFraction as number,
      byproductDryMassKg: value.byproductDryMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
