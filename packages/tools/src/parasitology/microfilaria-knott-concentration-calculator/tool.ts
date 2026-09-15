import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  fraction,
} from "../batch53-shared.js";

export type Input = Readonly<{
  microfilariaeCounted: number;
  originalBloodVolumeMl: number;
  aliquotFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "microfilariaeCounted",
    label: "Microfilariae counted",
    kind: "number",
  },
  {
    id: "originalBloodVolumeMl",
    label: "Original blood volume ml",
    kind: "number",
  },
  { id: "aliquotFraction", label: "Aliquot fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.microfilariaeCounted, "count", 0, 1e9);
  positive(i.originalBloodVolumeMl, "volume");
  fraction(i.aliquotFraction, "fraction");
  positive(i.aliquotFraction, "fraction");
  return {
    microfilariaePerMl:
      i.microfilariaeCounted / (i.originalBloodVolumeMl * i.aliquotFraction),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    microfilariaeCounted: 20,
    originalBloodVolumeMl: 1,
    aliquotFraction: 0.5,
  },
  output: { result: { microfilariaePerMl: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/microfilaria-knott-concentration-calculator",
  title: "Microfilaria Count per mL Knott Technique Concentration Calculator",
  description:
    "Normalize Knott concentration counts to original blood volume and analyzed aliquot fraction; no assumed recovery correction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
