import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly compressionRatio: number;
  readonly cutoffRatio: number;
  readonly heatCapacityRatio: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "compressionRatio", label: "Compression ratio", kind: "number" },
  { id: "cutoffRatio", label: "Cutoff ratio", kind: "number" },
  { id: "heatCapacityRatio", label: "Heat capacity ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.compressionRatio, "compressionRatio");
  positive(input.cutoffRatio, "cutoffRatio");
  positive(input.heatCapacityRatio, "heatCapacityRatio");
  if (
    input.heatCapacityRatio <= 1 ||
    input.cutoffRatio <= 1 ||
    input.cutoffRatio > input.compressionRatio
  )
    simpleError("cycle", "γ>1,1<cutoff≤compression.");
  return {
    value:
      1 -
      (input.cutoffRatio ** input.heatCapacityRatio - 1) /
        (input.heatCapacityRatio *
          (input.cutoffRatio - 1) *
          input.compressionRatio ** (input.heatCapacityRatio - 1)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { compressionRatio: 4, cutoffRatio: 2, heatCapacityRatio: 2 },
  output: { result: { value: 0.625 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/diesel-cycle-efficiency",
  title: "Diesel Cycle Efficiency Calculator",
  description:
    "Ideal constant\u03b3Diesel cycle efficiency,1<cutoff\u2264compression ratio,\u03b3>1; not actual engine outcome or variable-temperature heat capacity. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
