import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredGap: number;
  readonly callerLimit: number;
};
export type Output = { readonly margin: number; readonly withinLimit: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredGap: { type: "number", minimum: 0 },
    callerLimit: { type: "number", minimum: 0 },
  },
  required: ["measuredGap", "callerLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { margin: { type: "number" }, withinLimit: { type: "boolean" } },
  required: ["margin", "withinLimit"],
} as const;
/** Compare a measured gap with an explicit caller-supplied limit; the calculation does not select a regulation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredGap, callerLimit } = request;
  const compute = (): Output => {
    H.domain(measuredGap >= 0 && callerLimit >= 0);
    return {
      margin: callerLimit - measuredGap,
      withinLimit: measuredGap <= callerLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredGap: 95, callerLimit: 100 },
  output: { margin: 5, withinLimit: true },
} satisfies ToolExample<Input, Output>;
export const balconyGuardGapExplicitClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/balcony-guard-gap-explicit-clearance",
    title: "Balcony Guard Gap Explicit Clearance Tool",
    description:
      "Compare a measured gap with an explicit caller-supplied limit; the calculation does not select a regulation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredGap: { type: "number", minimum: 0 },
        callerLimit: { type: "number", minimum: 0 },
      },
      required: ["measuredGap", "callerLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margin: { type: "number" },
        withinLimit: { type: "boolean" },
      },
      required: ["margin", "withinLimit"],
    },
    ports: {
      inputs: [
        {
          id: "measuredGap",
          label: "Measured Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "callerLimit",
          label: "Caller Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "withinLimit",
          label: "Within Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = balconyGuardGapExplicitClearanceTool.execute;
export default balconyGuardGapExplicitClearanceTool;
