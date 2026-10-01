import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  straightRodeLength: number;
  verticalSeparation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "straightRodeLength", label: "Straight rode length", kind: "number" },
  { id: "verticalSeparation", label: "Vertical separation", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.straightRodeLength);
  H.bounded(i.verticalSeparation, 0, i.straightRodeLength);
  return H.finish({
    horizontalReach: Math.sqrt(
      (i.straightRodeLength - i.verticalSeparation) *
        (i.straightRodeLength + i.verticalSeparation),
    ),
    angleFromHorizontalDegrees: H.degrees(
      Math.asin(i.verticalSeparation / i.straightRodeLength),
    ),
  });
};
export const example = {
  input: { straightRodeLength: 5, verticalSeparation: 3 },
  output: {
    result: {
      horizontalReach: 4,
      angleFromHorizontalDegrees: 36.86989764584402,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "nautical/anchor-rode-angle-geometric",
  title: "Nautical: Anchor Rode Angle Geometric Tool",
  description:
    "Compute ideal taut straight-rode geometry only, ignoring catenary, surge, load and holding; not anchor-sizing or navigation safety advice.",
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
          angleFromHorizontalDegrees: { type: "number" },
          horizontalReach: { type: "number" },
        },
        required: ["angleFromHorizontalDegrees", "horizontalReach"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
