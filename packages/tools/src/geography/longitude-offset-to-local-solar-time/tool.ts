import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  longitudeDegrees: number;
  referenceMeridianDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "longitudeDegrees",
    label: "Longitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "referenceMeridianDegrees",
    label: "Reference meridian degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.longitudeDegrees, -180, 180);
  H.bounded(i.referenceMeridianDegrees, -180, 180);
  return H.finish({
    solarTimeOffsetSeconds:
      (i.longitudeDegrees - i.referenceMeridianDegrees) * 240,
  });
};
export const example = {
  input: { longitudeDegrees: 15, referenceMeridianDegrees: 0 },
  output: { result: { solarTimeOffsetSeconds: 3600 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geography/longitude-offset-to-local-solar-time",
  title: "Geography: Longitude Offset To Local Solar Time Tool",
  description:
    "Compute mean solar-time offset from an unwrapped longitude difference at four minutes per degree; no equation of time, civil timezone or date adjustment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { solarTimeOffsetSeconds: { type: "number" } },
        required: ["solarTimeOffsetSeconds"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
