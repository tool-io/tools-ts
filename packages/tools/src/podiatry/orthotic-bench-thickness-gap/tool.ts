import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredThickness: number;
  readonly baseThickness: number;
  readonly overlayThickness: number;
};
export type Output = {
  readonly expectedThickness: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredThickness: { type: "number", minimum: 0 },
    baseThickness: { type: "number", minimum: 0 },
    overlayThickness: { type: "number", minimum: 0 },
  },
  required: ["measuredThickness", "baseThickness", "overlayThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedThickness: { type: "number" },
    gap: { type: "number" },
  },
  required: ["expectedThickness", "gap"],
} as const;
/** Nominal supplied layer thickness closure, without orthotic design guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredThickness, baseThickness, overlayThickness } = request;
  const compute = (): Output => {
    H.domain(
      measuredThickness >= 0 && baseThickness >= 0 && overlayThickness >= 0,
    );
    return {
      expectedThickness: baseThickness + overlayThickness,
      gap: measuredThickness - baseThickness - overlayThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredThickness: 8, baseThickness: 5, overlayThickness: 2 },
  output: { expectedThickness: 7, gap: 1 },
} satisfies ToolExample<Input, Output>;
export const orthoticBenchThicknessGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/orthotic-bench-thickness-gap",
    title: "Orthotic Bench Thickness Gap Tool",
    description:
      "Nominal supplied layer thickness closure, without orthotic design guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredThickness: { type: "number", minimum: 0 },
        baseThickness: { type: "number", minimum: 0 },
        overlayThickness: { type: "number", minimum: 0 },
      },
      required: ["measuredThickness", "baseThickness", "overlayThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedThickness: { type: "number" },
        gap: { type: "number" },
      },
      required: ["expectedThickness", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredThickness",
          label: "Measured Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseThickness",
          label: "Base Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlayThickness",
          label: "Overlay Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedThickness",
          label: "Expected Thickness",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = orthoticBenchThicknessGapTool.execute;
export default orthoticBenchThicknessGapTool;
