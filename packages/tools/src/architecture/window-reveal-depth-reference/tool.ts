import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wallReferenceCoordinate: number;
  readonly windowFaceCoordinate: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wallReferenceCoordinate: { type: "number" },
    windowFaceCoordinate: { type: "number" },
  },
  required: ["wallReferenceCoordinate", "windowFaceCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit wall reference coordinate from the window face on a shared depth axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wallReferenceCoordinate, windowFaceCoordinate } = request;
  const compute = (): Output => {
    return { signedGap: windowFaceCoordinate - wallReferenceCoordinate };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wallReferenceCoordinate: 12, windowFaceCoordinate: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const windowRevealDepthReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["architecture", "arts and design"],
      keywords: ["architecture", "arts and design"],
    },
    id: "architecture/window-reveal-depth-reference",
    title: "Window Reveal Depth Reference",
    description:
      "Subtract an explicit wall reference coordinate from the window face on a shared depth axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wallReferenceCoordinate: { type: "number" },
        windowFaceCoordinate: { type: "number" },
      },
      required: ["wallReferenceCoordinate", "windowFaceCoordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "wallReferenceCoordinate",
          label: "Wall Reference Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowFaceCoordinate",
          label: "Window Face Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = windowRevealDepthReferenceTool.execute;
export default windowRevealDepthReferenceTool;
