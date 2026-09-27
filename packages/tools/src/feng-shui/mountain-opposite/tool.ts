import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ facingDegrees: number; reference: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "facingDegrees", label: "Facing degrees", kind: "number", unit: "deg" },
  {
    id: "reference",
    label: "Reference",
    kind: "string",
    enum: ["true", "magnetic"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.facingDegrees, 0, 360);
  H.choice(i.reference, ["true", "magnetic"]);
  const labels = [
      "Zi",
      "Gui",
      "Chou",
      "Gen",
      "Yin",
      "Jia",
      "Mao",
      "Yi",
      "Chen",
      "Xun",
      "Si",
      "Bing",
      "Wu",
      "Ding",
      "Wei",
      "Kun",
      "Shen",
      "Geng",
      "You",
      "Xin",
      "Xu",
      "Qian",
      "Hai",
      "Ren",
    ],
    facing = H.mod(i.facingDegrees, 360),
    sitting = H.mod(facing + 180, 360);
  return H.finish({
    facingDegrees: facing,
    sittingDegrees: sitting,
    facingMountain: labels[Math.floor((facing + 7.5) / 15) % 24],
    sittingMountain: labels[Math.floor((sitting + 7.5) / 15) % 24],
    reference: i.reference,
  });
};
export const example = {
  input: { facingDegrees: 0, reference: "true" },
  output: {
    result: {
      facingDegrees: 0,
      sittingDegrees: 180,
      facingMountain: "Zi",
      sittingMountain: "Wu",
      reference: "true",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "feng-shui/mountain-opposite",
  title: "Feng Shui Sitting and Facing Mountain Calculator",
  description:
    "Compute opposite facing/sitting bearings and conventional 15-degree twenty-four-mountain labels, north-centered half-open sectors; not a building assessment.",
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
          facingDegrees: { type: "number" },
          facingMountain: { type: "string" },
          reference: { type: "string" },
          sittingDegrees: { type: "number" },
          sittingMountain: { type: "string" },
        },
        required: [
          "facingDegrees",
          "facingMountain",
          "reference",
          "sittingDegrees",
          "sittingMountain",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
