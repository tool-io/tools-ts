import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ requiredUnits: number; packUnits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "requiredUnits", label: "Required units", kind: "integer" },
  { id: "packUnits", label: "Pack units", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.requiredUnits, 0, 1000000000);
  H.int(i.packUnits, 1, 1000000);
  return H.finish({
    packCount: Math.ceil(i.requiredUnits / i.packUnits),
    orderedUnits: Math.ceil(i.requiredUnits / i.packUnits) * i.packUnits,
    excessUnits:
      Math.ceil(i.requiredUnits / i.packUnits) * i.packUnits - i.requiredUnits,
  });
};
export const example = {
  input: { requiredUnits: 11, packUnits: 5 },
  output: { result: { packCount: 3, orderedUnits: 15, excessUnits: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "supply-chain/reorder-pack-rounding-residual",
  title: "Supply Chain Management: Reorder Pack Rounding Residual Tool",
  description:
    "Round one nonnegative replenishment requirement up to whole supplier packs and expose the over-order residual, without inventory forecasting.",
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
          excessUnits: { type: "number" },
          orderedUnits: { type: "number" },
          packCount: { type: "number" },
        },
        required: ["excessUnits", "orderedUnits", "packCount"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
