import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  signOrdinal: number;
  withinSignDegrees: number;
  zodiac: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "signOrdinal", label: "Sign ordinal", kind: "integer" },
  {
    id: "withinSignDegrees",
    label: "Within sign degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "zodiac",
    label: "Zodiac",
    kind: "string",
    enum: ["tropical", "sidereal-resolved"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.signOrdinal, 1, 12);
  H.check(i.withinSignDegrees >= 0 && i.withinSignDegrees < 30);
  H.choice(i.zodiac, ["tropical", "sidereal-resolved"]);
  return H.finish({
    longitudeDegrees: 30 * (i.signOrdinal - 1) + i.withinSignDegrees,
    zodiac: i.zodiac,
  });
};
export const example = {
  input: { signOrdinal: 3, withinSignDegrees: 5, zodiac: "tropical" },
  output: { result: { longitudeDegrees: 65, zodiac: "tropical" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrology/zodiac-position-to-longitude",
  title: "Zodiac Sign and Degree to Longitude Converter",
  description:
    "Convert a one-based zodiac sector and half-open within-sign degree into longitude, retaining an explicit zodiac convention without a date or ephemeris.",
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
          longitudeDegrees: { type: "number" },
          zodiac: { type: "string" },
        },
        required: ["longitudeDegrees", "zodiac"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
