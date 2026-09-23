import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  temperature: number;
  minimumApproach: number;
  stream: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "temperature", label: "Temperature", kind: "number" },
  { id: "minimumApproach", label: "Minimum approach", kind: "number" },
  { id: "stream", label: "Stream", kind: "string", enum: ["hot", "cold"] },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.minimumApproach >= 0);
  H.choice(i.stream, ["hot", "cold"]);
  return H.finish({
    shiftedTemperature:
      i.temperature + ((i.stream === "hot" ? -1 : 1) * i.minimumApproach) / 2,
  });
};
export const example = {
  input: { temperature: 100, minimumApproach: 20, stream: "hot" },
  output: { result: { shiftedTemperature: 90 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "chemical-engineering/pinch-hot-cold-shifted-temperature",
  title: "Chemical Engineering: Pinch Hot Cold Shifted Temperature Tool",
  description:
    "Apply the symmetric hot-minus/cold-plus half-approach temperature shift for a caller-selected pinch-analysis convention; no process network optimization.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { shiftedTemperature: { type: "number" } },
        required: ["shiftedTemperature"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
