import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly crestElevation: number;
  readonly bedElevation: number;
  readonly settlement: number;
};
export type Output = { readonly effectiveHeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crestElevation: { type: "number" },
    bedElevation: { type: "number" },
    settlement: { type: "number", minimum: 0 },
  },
  required: ["crestElevation", "bedElevation", "settlement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveHeight: { type: "number" } },
  required: ["effectiveHeight"],
} as const;
/** Common-datum crest/bed height difference after supplied settlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { crestElevation, bedElevation, settlement } = request;
  const compute = (): Output => {
    H.domain(settlement >= 0);
    return { effectiveHeight: crestElevation - bedElevation - settlement };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { crestElevation: 102, bedElevation: 100, settlement: 0.2 },
  output: { effectiveHeight: 1.8 },
} satisfies ToolExample<Input, Output>;
export const swaleCheckDamHeightOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/swale-check-dam-height-offset",
    title: "Swale Check Dam Height Offset Tool",
    description:
      "Common-datum crest/bed height difference after supplied settlement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crestElevation: { type: "number" },
        bedElevation: { type: "number" },
        settlement: { type: "number", minimum: 0 },
      },
      required: ["crestElevation", "bedElevation", "settlement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { effectiveHeight: { type: "number" } },
      required: ["effectiveHeight"],
    },
    ports: {
      inputs: [
        {
          id: "crestElevation",
          label: "Crest Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bedElevation",
          label: "Bed Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "settlement",
          label: "Settlement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveHeight",
          label: "Effective Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = swaleCheckDamHeightOffsetTool.execute;
export default swaleCheckDamHeightOffsetTool;
