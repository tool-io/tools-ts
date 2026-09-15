import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch53-shared.js";

export type Input = Readonly<{
  reciprocalEndpoint: number;
  endpointKnown: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "reciprocalEndpoint", label: "Reciprocal endpoint", kind: "number" },
  { id: "endpointKnown", label: "Endpoint known", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(i.reciprocalEndpoint, "reciprocal");
  return {
    recordedReciprocal: i.endpointKnown ? i.reciprocalEndpoint : null,
    diagnosis: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { reciprocalEndpoint: 16, endpointKnown: true },
  output: { result: { recordedReciprocal: 16, diagnosis: "not-established" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/sabinfeldman-titer-recorder",
  title: "Sabin-Feldman Dye Test Titer Reciprocal Recorder",
  description:
    "Record a separately identified Sabin-Feldman reciprocal titer; no automated endpoint reading or infection timing.",
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
