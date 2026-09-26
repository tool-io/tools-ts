import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly side: string;
  readonly mirrored: boolean;
  readonly direction: string;
  readonly reversed: boolean;
};
export type Output = { readonly side: string; readonly direction: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    side: { type: "string", maxLength: 8192, enum: ["left", "right"] },
    mirrored: { type: "boolean" },
    direction: { type: "string", maxLength: 8192 },
    reversed: { type: "boolean" },
  },
  required: ["side", "mirrored", "direction", "reversed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    side: { type: "string", maxLength: 8192 },
    direction: { type: "string", maxLength: 8192 },
  },
  required: ["side", "direction"],
} as const;
/** Transform supplied side and axis-direction labels under explicit mirror/reversal flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { side, mirrored, direction, reversed } = request;
  const compute = (): Output => {
    H.domain(
      ["left", "right"].includes(side) &&
        ["apical", "coronal"].includes(direction),
      "side",
    );
    return {
      side: mirrored ? (side === "left" ? "right" : "left") : side,
      direction: reversed
        ? direction === "apical"
          ? "coronal"
          : "apical"
        : direction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { side: "left", mirrored: true, direction: "apical", reversed: false },
  output: { side: "right", direction: "apical" },
} satisfies ToolExample<Input, Output>;
export const rootModelLabelSideOrientationPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/root-model-label-side-orientation-pair",
    title: "Root Model Label Side Orientation Pair Tool",
    description:
      "Transform supplied side and axis-direction labels under explicit mirror/reversal flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        side: { type: "string", maxLength: 8192, enum: ["left", "right"] },
        mirrored: { type: "boolean" },
        direction: { type: "string", maxLength: 8192 },
        reversed: { type: "boolean" },
      },
      required: ["side", "mirrored", "direction", "reversed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        side: { type: "string", maxLength: 8192 },
        direction: { type: "string", maxLength: 8192 },
      },
      required: ["side", "direction"],
    },
    ports: {
      inputs: [
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mirrored",
          label: "Mirrored",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reversed",
          label: "Reversed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "side", label: "Side", valueType: { type: "string" } },
        { id: "direction", label: "Direction", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = rootModelLabelSideOrientationPairTool.execute;
export default rootModelLabelSideOrientationPairTool;
