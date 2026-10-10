import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizontalRun: number;
  readonly suppliedSlopeFraction: number;
};
export type Output = { readonly signedVerticalDrop: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalRun: { type: "number", minimum: 0 },
    suppliedSlopeFraction: { type: "number" },
  },
  required: ["horizontalRun", "suppliedSlopeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedVerticalDrop: { type: "number" } },
  required: ["signedVerticalDrop"],
} as const;
/** Multiply explicit horizontal channel run by supplied signed drop-per-run slope without recommending a channel slope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { horizontalRun, suppliedSlopeFraction } = request;
  const compute = (): Output => {
    H.domain(horizontalRun >= 0, "horizontalRun");
    return { signedVerticalDrop: horizontalRun * suppliedSlopeFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { horizontalRun: 4, suppliedSlopeFraction: 0.02 },
  output: { signedVerticalDrop: 0.08 },
} satisfies ToolExample<Input, Output>;
export const hydroponicChannelSlopeDropTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["hydroponics", "agriculture"],
      keywords: ["hydroponics", "agriculture"],
    },
    id: "hydroponics/hydroponic-channel-slope-drop",
    title: "Hydroponic Channel Slope Drop",
    description:
      "Multiply explicit horizontal channel run by supplied signed drop-per-run slope without recommending a channel slope.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalRun: { type: "number", minimum: 0 },
        suppliedSlopeFraction: { type: "number" },
      },
      required: ["horizontalRun", "suppliedSlopeFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedVerticalDrop: { type: "number" } },
      required: ["signedVerticalDrop"],
    },
    ports: {
      inputs: [
        {
          id: "horizontalRun",
          label: "Horizontal Run",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSlopeFraction",
          label: "Supplied Slope Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedVerticalDrop",
          label: "Signed Vertical Drop",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydroponicChannelSlopeDropTool.execute;
export default hydroponicChannelSlopeDropTool;
