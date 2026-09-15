import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, countFraction } from "../batch53-shared.js";

export type Input = Readonly<{
  gametocyteInfectedRbc: number;
  rbcCounted: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "gametocyteInfectedRbc",
    label: "Gametocyte infected rbc",
    kind: "number",
  },
  { id: "rbcCounted", label: "Rbc counted", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    gametocytemiaPercent:
      100 * countFraction(i.gametocyteInfectedRbc, i.rbcCounted),
    causalInference: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { gametocyteInfectedRbc: 2, rbcCounted: 10 },
  output: {
    result: { gametocytemiaPercent: 20.0, causalInference: "not-established" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/gametocytemia-transmissibility-proxy",
  title: "Gametocytemia Percent Infected RBC Transmissibility Proxy Calculator",
  description:
    "Compute the observed Gametocytemia Percent Infected RBC Transmissibility Proxy Calculator fraction from explicit subset and total counts; not a transmission, survival or viability guarantee.",
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
