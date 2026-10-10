import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceZ: number;
  readonly scanFocusZ: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceZ: { type: "number" },
    scanFocusZ: { type: "number" },
  },
  required: ["referenceZ", "scanFocusZ"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed supplied scan-focus-minus-reference z coordinate in matching units without judging image focus. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceZ, scanFocusZ } = request;
  const compute = (): Output => {
    return { signedGap: scanFocusZ - referenceZ };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceZ: 12, scanFocusZ: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const slideScanFocusPlaneOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/slide-scan-focus-plane-offset",
    title: "Slide Scan Focus Plane Offset Tool",
    description:
      "Calculate signed supplied scan-focus-minus-reference z coordinate in matching units without judging image focus.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceZ: { type: "number" },
        scanFocusZ: { type: "number" },
      },
      required: ["referenceZ", "scanFocusZ"],
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
          id: "referenceZ",
          label: "Reference Z",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scanFocusZ",
          label: "Scan Focus Z",
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
export const run = slideScanFocusPlaneOffsetTool.execute;
export default slideScanFocusPlaneOffsetTool;
