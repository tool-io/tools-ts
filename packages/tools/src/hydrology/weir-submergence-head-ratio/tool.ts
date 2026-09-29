import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upstreamHead: number;
  readonly downstreamHead: number;
};
export type Output = { readonly submergence: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upstreamHead: { type: "number", exclusiveMinimum: 0 },
    downstreamHead: { type: "number", minimum: 0 },
  },
  required: ["upstreamHead", "downstreamHead"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { submergence: { type: "number" } },
  required: ["submergence"],
} as const;
/** Calculate weir submergence head ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upstreamHead, downstreamHead } = request;
  const compute = (): Output => {
    H.positive(upstreamHead);
    H.domain(downstreamHead >= 0);
    return { submergence: downstreamHead / upstreamHead };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { upstreamHead: 2, downstreamHead: 1.5 },
  output: { submergence: 0.75 },
} satisfies ToolExample<Input, Output>;
export const weirSubmergenceHeadRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/weir-submergence-head-ratio",
    title: "Weir Submergence Head Ratio Tool",
    description:
      "Calculate weir submergence head ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upstreamHead: { type: "number", exclusiveMinimum: 0 },
        downstreamHead: { type: "number", minimum: 0 },
      },
      required: ["upstreamHead", "downstreamHead"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { submergence: { type: "number" } },
      required: ["submergence"],
    },
    ports: {
      inputs: [
        {
          id: "upstreamHead",
          label: "Upstream Head",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "downstreamHead",
          label: "Downstream Head",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "submergence",
          label: "Submergence",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = weirSubmergenceHeadRatioTool.execute;
export default weirSubmergenceHeadRatioTool;
