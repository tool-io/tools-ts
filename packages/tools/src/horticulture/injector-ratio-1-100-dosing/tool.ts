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
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedStockDrawMl: number;
  readonly observedCarrierWaterMl: number;
  readonly stockTracerMgLiter: number;
  readonly carrierTracerMgLiter: number;
  readonly callerNominalFinalDilutionDenominator: number;
}>;
export type Output = Readonly<{
  readonly observedStockFractionOfFinalFlow: number;
  readonly observedFinalToStockDilution: number;
  readonly modeledFinalTracerMgLiter: number;
  readonly signedDilutionMinusCallerNominal: number;
}>;
const inputFields = [
  {
    id: "observedStockDrawMl",
    label: "Observed stock draw ml",
    kind: "number",
  },
  {
    id: "observedCarrierWaterMl",
    label: "Observed carrier water ml",
    kind: "number",
  },
  { id: "stockTracerMgLiter", label: "Stock tracer mg liter", kind: "number" },
  {
    id: "carrierTracerMgLiter",
    label: "Carrier tracer mg liter",
    kind: "number",
  },
  {
    id: "callerNominalFinalDilutionDenominator",
    label: "Caller nominal final dilution denominator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedStockDrawMl, "observedStockDrawMl");
  positive(
    input.callerNominalFinalDilutionDenominator,
    "callerNominalFinalDilutionDenominator",
  );
  nonnegative(input.observedCarrierWaterMl, "observedCarrierWaterMl");
  nonnegative(input.stockTracerMgLiter, "stockTracerMgLiter");
  nonnegative(input.carrierTracerMgLiter, "carrierTracerMgLiter");
  const total = input.observedStockDrawMl + input.observedCarrierWaterMl;
  if (!Number.isFinite(total))
    simpleError("flow", "Finite total mixture volume required.");
  const fraction = input.observedStockDrawMl / total,
    denominator = total / input.observedStockDrawMl;
  return {
    observedStockFractionOfFinalFlow: fraction,
    observedFinalToStockDilution: denominator,
    modeledFinalTracerMgLiter:
      input.stockTracerMgLiter * fraction +
      input.carrierTracerMgLiter * (1 - fraction),
    signedDilutionMinusCallerNominal:
      denominator - input.callerNominalFinalDilutionDenominator,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStockDrawMl: 10,
  observedCarrierWaterMl: 990,
  stockTracerMgLiter: 1000,
  carrierTracerMgLiter: 0,
  callerNominalFinalDilutionDenominator: 100,
} satisfies Input;
export const exampleOutput = {
  observedStockFractionOfFinalFlow: 0.01,
  observedFinalToStockDilution: 100,
  modeledFinalTracerMgLiter: 10,
  signedDilutionMinusCallerNominal: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/injector-ratio-1-100-dosing",
  title: "Injector Ratio 1 To 100 Dosing Calculator",
  description:
    "Audit actual injector stock/carrier draw and tracer dilution using final:stock ratio convention; distinguishes 1 stock+100 carrier (101 final) from 1:100 final, not inverse nitrogen-stock recipe or chemical dosing recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedStockFractionOfFinalFlow",
      label: "Observed stock fraction of final flow",
      kind: "number",
    },
    {
      id: "observedFinalToStockDilution",
      label: "Observed final to stock dilution",
      kind: "number",
    },
    {
      id: "modeledFinalTracerMgLiter",
      label: "Modeled final tracer mg liter",
      kind: "number",
    },
    {
      id: "signedDilutionMinusCallerNominal",
      label: "Signed dilution minus caller nominal",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStockDrawMl: value.observedStockDrawMl as number,
      observedCarrierWaterMl: value.observedCarrierWaterMl as number,
      stockTracerMgLiter: value.stockTracerMgLiter as number,
      carrierTracerMgLiter: value.carrierTracerMgLiter as number,
      callerNominalFinalDilutionDenominator:
        value.callerNominalFinalDilutionDenominator as number,
    }),
});
export const run = tool.execute;
export default tool;
