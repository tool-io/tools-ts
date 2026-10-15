import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ mapqValues: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "mapqValues", label: "Mapq values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  i.mapqValues.forEach((v) => bounded(v, "MAPQ", 0, 255));
  return {
    zeroMapqCount: i.mapqValues.filter((v) => v === 0).length,
    unavailable255Count: i.mapqValues.filter((v) => v === 255).length,
    multiMappingConfirmed: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
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

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          zeroMapqCount: { type: "number" },
          unavailable255Count: { type: "number" },
          multiMappingConfirmed: { type: "boolean" },
        },
        required: [
          "zeroMapqCount",
          "unavailable255Count",
          "multiMappingConfirmed",
        ],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
