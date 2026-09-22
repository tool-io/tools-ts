import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ longitudeDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "longitudeDegrees",
    label: "Longitude degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.longitudeDegrees, 0, 360);
  return H.finish({
    reflectedLongitudeDegrees: H.mod(180 - i.longitudeDegrees, 360),
  });
};
export const example = {
  input: { longitudeDegrees: 35 },
  output: { result: { reflectedLongitudeDegrees: 145 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrology/antiscia-points",
  title: "Astrological Antiscia Point Calculator",
  description:
    "Reflect one resolved zodiac longitude under the conventional solstitial antiscia map, normalized to [0,360); symbolic geometry, no prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reflectedLongitudeDegrees: { type: "number" } },
        required: ["reflectedLongitudeDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
