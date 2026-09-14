import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  sum,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly measuredStringTensionsN: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "measuredStringTensionsN",
    label: "Measured string tensions n",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (
    !i.measuredStringTensionsN.length ||
    i.measuredStringTensionsN.length > 128
  )
    simpleError("strings", "1–128 actual strings.");
  i.measuredStringTensionsN.forEach((v) => nonnegative(v, "tension"));
  return { totalTensionN: sum(i.measuredStringTensionsN) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { measuredStringTensionsN: [40, 50, 60] },
  output: { result: { totalTensionN: 150 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/string-instrument-total-string-tension-sum",
  title: "String Instrument Total Tension Sum",
  description:
    "Sum actual individual string tensions; not bridge resultant or structural load certification.",
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
