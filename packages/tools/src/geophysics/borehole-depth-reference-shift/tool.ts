import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loggedDepth: number;
  readonly loggedZeroBelowReference: number;
};
export type Output = { readonly referencedDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loggedDepth: { type: "number" },
    loggedZeroBelowReference: { type: "number" },
  },
  required: ["loggedDepth", "loggedZeroBelowReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referencedDepth: { type: "number" } },
  required: ["referencedDepth"],
} as const;
/** Apply an explicitly signed logging-zero offset to a borehole depth on a downward-positive axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loggedDepth, loggedZeroBelowReference } = request;
  const compute = (): Output => {
    return { referencedDepth: loggedDepth + loggedZeroBelowReference };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { loggedDepth: 120, loggedZeroBelowReference: 2.5 },
  output: { referencedDepth: 122.5 },
} satisfies ToolExample<Input, Output>;
export const boreholeDepthReferenceShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geophysics", "physics"],
      keywords: ["geophysics", "physics"],
    },
    id: "geophysics/borehole-depth-reference-shift",
    title: "Borehole Depth Reference Shift",
    description:
      "Apply an explicitly signed logging-zero offset to a borehole depth on a downward-positive axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loggedDepth: { type: "number" },
        loggedZeroBelowReference: { type: "number" },
      },
      required: ["loggedDepth", "loggedZeroBelowReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referencedDepth: { type: "number" } },
      required: ["referencedDepth"],
    },
    ports: {
      inputs: [
        {
          id: "loggedDepth",
          label: "Logged Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loggedZeroBelowReference",
          label: "Logged Zero Below Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referencedDepth",
          label: "Referenced Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boreholeDepthReferenceShiftTool.execute;
export default boreholeDepthReferenceShiftTool;
