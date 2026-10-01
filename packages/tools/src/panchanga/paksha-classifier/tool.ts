import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ tithiOrdinal: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tithiOrdinal", label: "Tithi ordinal", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.tithiOrdinal, 1, 30);
  return H.finish({
    paksha: i.tithiOrdinal <= 15 ? "shukla" : "krishna",
    withinFortnight: ((i.tithiOrdinal - 1) % 15) + 1,
  });
};
export const example = {
  input: { tithiOrdinal: 16 },
  output: { result: { paksha: "krishna", withinFortnight: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "panchanga/paksha-classifier",
  title: "Panchanga Paksha Classifier",
  description:
    "Classify a resolved tithi ordinal into waxing Shukla or waning Krishna fortnight and its one-based position, without predicting dates.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          paksha: { type: "string" },
          withinFortnight: { type: "number" },
        },
        required: ["paksha", "withinFortnight"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
