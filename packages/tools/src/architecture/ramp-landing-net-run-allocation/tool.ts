import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalRun: number;
  readonly landingLengths: readonly number[];
};
export type Output = { readonly slopedRun: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalRun: { type: "number", minimum: 0 },
    landingLengths: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["totalRun", "landingLengths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slopedRun: { type: "number" } },
  required: ["slopedRun"],
} as const;
/** Subtract explicit horizontal landing lengths from the allocated ramp run without choosing a building-code limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalRun, landingLengths } = request;
  const compute = (): Output => {
    H.domain(
      totalRun >= 0 &&
        landingLengths.every((x) => x >= 0) &&
        landingLengths.reduce((a, b) => a + b, 0) <= totalRun,
    );
    return { slopedRun: totalRun - landingLengths.reduce((a, b) => a + b, 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalRun: 15, landingLengths: [2, 3] },
  output: { slopedRun: 10 },
} satisfies ToolExample<Input, Output>;
export const rampLandingNetRunAllocationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/ramp-landing-net-run-allocation",
    title: "Ramp Landing Net Run Allocation Tool",
    description:
      "Subtract explicit horizontal landing lengths from the allocated ramp run without choosing a building-code limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRun: { type: "number", minimum: 0 },
        landingLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["totalRun", "landingLengths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slopedRun: { type: "number" } },
      required: ["slopedRun"],
    },
    ports: {
      inputs: [
        {
          id: "totalRun",
          label: "Total Run",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "landingLengths",
          label: "Landing Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "slopedRun", label: "Sloped Run", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rampLandingNetRunAllocationTool.execute;
export default rampLandingNetRunAllocationTool;
