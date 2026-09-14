import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly referenceEtMm: number;
  readonly cropCoefficient: number;
  readonly deficitFraction: number;
  readonly deliveryEfficiency: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "referenceEtMm", label: "Reference et mm", kind: "number" },
  { id: "cropCoefficient", label: "Crop coefficient", kind: "number" },
  { id: "deficitFraction", label: "Deficit fraction", kind: "number" },
  { id: "deliveryEfficiency", label: "Delivery efficiency", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.referenceEtMm, "et");
  nonnegative(i.cropCoefficient, "kc");
  fraction(i.deficitFraction, "deficit");
  fraction(i.deliveryEfficiency, "efficiency");
  positive(i.deliveryEfficiency, "efficiency");
  return {
    grossIrrigationMm:
      (i.referenceEtMm * i.cropCoefficient * i.deficitFraction) /
      i.deliveryEfficiency,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    referenceEtMm: 10,
    cropCoefficient: 0.8,
    deficitFraction: 0.5,
    deliveryEfficiency: 0.8,
  },
  output: { result: { grossIrrigationMm: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/regulated-deficit-irrigation-et-fraction",
  title: "Regulated Deficit Irrigation ET Fraction Calculator",
  description:
    "Conditional gross irrigation depth from reference ET, caller crop coefficient and deficit fraction; not an irrigation prescription.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
