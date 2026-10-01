import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentIndex: number;
  readonly advance: number;
  readonly cellCount: number;
};
export type Output = { readonly nextIndex: number; readonly wraps: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentIndex: { type: "integer", minimum: 0 },
    advance: { type: "integer" },
    cellCount: { type: "integer", minimum: 1 },
  },
  required: ["currentIndex", "advance", "cellCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextIndex: { type: "integer" }, wraps: { type: "integer" } },
  required: ["nextIndex", "wraps"],
} as const;
/** Advance a supplied zero-based scanning index with exact signed wrap count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentIndex, advance, cellCount } = request;
  const compute = (): Output => {
    H.integer(cellCount, 1);
    H.integer(currentIndex, 0, cellCount - 1);
    const total = BigInt(currentIndex) + BigInt(advance),
      n = BigInt(cellCount);
    let q = total / n,
      r = total % n;
    if (r < 0n) {
      q--;
      r += n;
    }
    return { nextIndex: Number(r), wraps: Number(q) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentIndex: 7, advance: 4, cellCount: 10 },
  output: { nextIndex: 1, wraps: 1 },
} satisfies ToolExample<Input, Output>;
export const assistiveSwitchScanWrapTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/assistive-switch-scan-wrap-token",
    title: "Assistive Switch Scan Wrap Token Tool",
    description:
      "Advance a supplied zero-based scanning index with exact signed wrap count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentIndex: { type: "integer", minimum: 0 },
        advance: { type: "integer" },
        cellCount: { type: "integer", minimum: 1 },
      },
      required: ["currentIndex", "advance", "cellCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextIndex: { type: "integer" },
        wraps: { type: "integer" },
      },
      required: ["nextIndex", "wraps"],
    },
    ports: {
      inputs: [
        {
          id: "currentIndex",
          label: "Current Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "advance",
          label: "Advance",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cellCount",
          label: "Cell Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nextIndex",
          label: "Next Index",
          valueType: { type: "integer" },
        },
        { id: "wraps", label: "Wraps", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = assistiveSwitchScanWrapTokenTool.execute;
export default assistiveSwitchScanWrapTokenTool;
