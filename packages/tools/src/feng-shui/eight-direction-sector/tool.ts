import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ bearingDegrees: number; reference: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "bearingDegrees",
    label: "Bearing degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "reference",
    label: "Reference",
    kind: "string",
    enum: ["true", "magnetic"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.bearingDegrees, 0, 360);
  H.choice(i.reference, ["true", "magnetic"]);
  const index = Math.floor((H.mod(i.bearingDegrees, 360) + 22.5) / 45) % 8;
  return H.finish({
    sector: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][index],
    sectorIndex: index,
    reference: i.reference,
  });
};
export const example = {
  input: { bearingDegrees: 22.5, reference: "true" },
  output: { result: { sector: "NE", sectorIndex: 1, reference: "true" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "feng-shui/eight-direction-sector",
  title: "Feng Shui Eight-Direction Sector Calculator",
  description:
    "Classify a bearing into eight centered half-open compass sectors under an explicitly declared true/magnetic reference; no magnetic correction or efficacy claim.",
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
          reference: { type: "string" },
          sector: { type: "string" },
          sectorIndex: { type: "number" },
        },
        required: ["reference", "sector", "sectorIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
