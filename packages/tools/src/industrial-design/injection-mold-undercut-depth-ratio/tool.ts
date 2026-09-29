import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly undercutDepth: number;
  readonly referenceDepth: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    undercutDepth: { type: "number", minimum: 0 },
    referenceDepth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["undercutDepth", "referenceDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate injection mold undercut depth ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { undercutDepth, referenceDepth } = request;
  const compute = (): Output => {
    H.domain(undercutDepth >= 0);
    H.positive(referenceDepth);
    return { ratio: undercutDepth / referenceDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { undercutDepth: 2, referenceDepth: 20 },
  output: { ratio: 0.1 },
} satisfies ToolExample<Input, Output>;
export const injectionMoldUndercutDepthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/injection-mold-undercut-depth-ratio",
    title: "Injection Mold Undercut Depth Ratio Tool",
    description:
      "Calculate injection mold undercut depth ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        undercutDepth: { type: "number", minimum: 0 },
        referenceDepth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["undercutDepth", "referenceDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "undercutDepth",
          label: "Undercut Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDepth",
          label: "Reference Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = injectionMoldUndercutDepthRatioTool.execute;
export default injectionMoldUndercutDepthRatioTool;
