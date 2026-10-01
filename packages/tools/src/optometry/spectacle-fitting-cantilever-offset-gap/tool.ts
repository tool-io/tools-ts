import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameOffset: number;
  readonly supportOffset: number;
  readonly flexionOffset: number;
  readonly allowedOffset: number;
};
export type Output = {
  readonly netOffset: number;
  readonly absoluteOffset: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameOffset: { type: "number" },
    supportOffset: { type: "number" },
    flexionOffset: { type: "number" },
    allowedOffset: { type: "number", minimum: 0 },
  },
  required: ["frameOffset", "supportOffset", "flexionOffset", "allowedOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netOffset: { type: "number" },
    absoluteOffset: { type: "number" },
    margin: { type: "number" },
  },
  required: ["netOffset", "absoluteOffset", "margin"],
} as const;
/** Calculate spectacle fitting cantilever offset gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameOffset, supportOffset, flexionOffset, allowedOffset } = request;
  const compute = (): Output => {
    H.domain(allowedOffset >= 0);
    return {
      netOffset: frameOffset - supportOffset + flexionOffset,
      absoluteOffset: Math.abs(frameOffset - supportOffset + flexionOffset),
      margin:
        allowedOffset - Math.abs(frameOffset - supportOffset + flexionOffset),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frameOffset: 5,
    supportOffset: 2,
    flexionOffset: 1,
    allowedOffset: 6,
  },
  output: { netOffset: 4, absoluteOffset: 4, margin: 2 },
} satisfies ToolExample<Input, Output>;
export const spectacleFittingCantileverOffsetGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "optometry/spectacle-fitting-cantilever-offset-gap",
      title: "Spectacle Fitting Cantilever Offset Gap Tool",
      description:
        "Calculate spectacle fitting cantilever offset gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          frameOffset: { type: "number" },
          supportOffset: { type: "number" },
          flexionOffset: { type: "number" },
          allowedOffset: { type: "number", minimum: 0 },
        },
        required: [
          "frameOffset",
          "supportOffset",
          "flexionOffset",
          "allowedOffset",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netOffset: { type: "number" },
          absoluteOffset: { type: "number" },
          margin: { type: "number" },
        },
        required: ["netOffset", "absoluteOffset", "margin"],
      },
      ports: {
        inputs: [
          {
            id: "frameOffset",
            label: "Frame Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "supportOffset",
            label: "Support Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "flexionOffset",
            label: "Flexion Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "allowedOffset",
            label: "Allowed Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netOffset",
            label: "Net Offset",
            valueType: { type: "number" },
          },
          {
            id: "absoluteOffset",
            label: "Absolute Offset",
            valueType: { type: "number" },
          },
          { id: "margin", label: "Margin", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = spectacleFittingCantileverOffsetGapTool.execute;
export default spectacleFittingCantileverOffsetGapTool;
