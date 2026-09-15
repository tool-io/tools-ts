import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ mapqValues: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mapqValues", label: "Mapq values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  i.mapqValues.forEach((v) => bounded(v, "MAPQ", 0, 255));
  return {
    zeroMapqCount: i.mapqValues.filter((v) => v === 0).length,
    unavailable255Count: i.mapqValues.filter((v) => v === 255).length,
    multiMappingConfirmed: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { mapqValues: [0, 20, 255, 0] },
  output: {
    result: {
      zeroMapqCount: 2,
      unavailable255Count: 1,
      multiMappingConfirmed: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/multimap-mapqzero-flag-counter",
  title: "Multi-Mapping Read Ambiguity MAPQ Zero Flag Counter",
  description:
    "Count MAPQ zero and unavailable-255 separately; zero MAPQ indicates low confidence, not proof of a unique multi-mapping mechanism.",
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
