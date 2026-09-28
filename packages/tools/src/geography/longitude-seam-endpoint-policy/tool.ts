import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ longitudeDegrees: number; seamPolicy: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "longitudeDegrees",
    label: "Longitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "seamPolicy",
    label: "Seam policy",
    kind: "string",
    enum: ["positive", "negative"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.longitudeDegrees, -1000000, 1000000);
  H.choice(i.seamPolicy, ["positive", "negative"]);
  const v = H.mod(i.longitudeDegrees + 180, 360) - 180;
  return H.finish({
    longitudeDegrees: i.seamPolicy === "positive" && v === -180 ? 180 : v,
  });
};
export const example = {
  input: { longitudeDegrees: 180, seamPolicy: "negative" },
  output: { result: { longitudeDegrees: -180 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geography/longitude-seam-endpoint-policy",
  title: "Geography: Longitude Seam Endpoint Policy Tool",
  description:
    "Normalize longitude to a single-turn interval with explicitly chosen positive or negative 180-degree seam representative.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { longitudeDegrees: { type: "number" } },
        required: ["longitudeDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
