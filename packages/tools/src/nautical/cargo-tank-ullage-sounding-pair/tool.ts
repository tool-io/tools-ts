import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  tankHeight: number;
  measuredDistance: number;
  measurement: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tankHeight", label: "Tank height", kind: "number" },
  { id: "measuredDistance", label: "Measured distance", kind: "number" },
  {
    id: "measurement",
    label: "Measurement",
    kind: "string",
    enum: ["ullage", "sounding"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.tankHeight);
  H.bounded(i.measuredDistance, 0, i.tankHeight);
  H.choice(i.measurement, ["ullage", "sounding"]);
  return H.finish({
    ullage:
      i.measurement === "ullage"
        ? i.measuredDistance
        : i.tankHeight - i.measuredDistance,
    sounding:
      i.measurement === "sounding"
        ? i.measuredDistance
        : i.tankHeight - i.measuredDistance,
  });
};
export const example = {
  input: { tankHeight: 10, measuredDistance: 3, measurement: "ullage" },
  output: { result: { ullage: 3, sounding: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "nautical/cargo-tank-ullage-sounding-pair",
  title: "Nautical: Cargo Tank Ullage Sounding Pair Tool",
  description:
    "Crosswalk ideal vertical tank ullage/sounding using an explicit common top-to-bottom reference height; excludes trim, list, calibration and cargo volume.",
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
          sounding: { type: "number" },
          ullage: { type: "number" },
        },
        required: ["sounding", "ullage"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
