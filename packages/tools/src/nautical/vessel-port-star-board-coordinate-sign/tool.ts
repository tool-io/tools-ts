import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  transverseCoordinate: number;
  positiveSide: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "transverseCoordinate",
    label: "Transverse coordinate",
    kind: "number",
  },
  {
    id: "positiveSide",
    label: "Positive side",
    kind: "string",
    enum: ["port", "starboard"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.positiveSide, ["port", "starboard"]);
  return H.finish({
    starboardPositiveCoordinate:
      i.positiveSide === "starboard"
        ? i.transverseCoordinate
        : -i.transverseCoordinate,
    side:
      i.transverseCoordinate === 0
        ? "centerline"
        : i.transverseCoordinate > 0 === (i.positiveSide === "starboard")
          ? "starboard"
          : "port",
  });
};
export const example = {
  input: { transverseCoordinate: 2, positiveSide: "port" },
  output: { result: { starboardPositiveCoordinate: -2, side: "port" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "nautical/vessel-port-star-board-coordinate-sign",
  title: "Nautical: Vessel Port Star Board Coordinate Sign Tool",
  description:
    "Crosswalk one vessel transverse coordinate under an explicitly declared port-positive or starboard-positive convention; no frame inference.",
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
          side: { type: "string" },
          starboardPositiveCoordinate: { type: "number" },
        },
        required: ["side", "starboardPositiveCoordinate"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
