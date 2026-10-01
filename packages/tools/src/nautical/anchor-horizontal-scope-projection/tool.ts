import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineLength: number;
  readonly verticalSeparation: number;
};
export type Output = { readonly horizontalReach: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineLength: { type: "number", minimum: 0 },
    verticalSeparation: { type: "number", minimum: 0 },
  },
  required: ["lineLength", "verticalSeparation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { horizontalReach: { type: "number" } },
  required: ["horizontalReach"],
} as const;
/** Return the straight taut-line geometric reach, excluding catenary shape and anchoring recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineLength, verticalSeparation } = request;
  const compute = (): Output => {
    H.domain(
      lineLength >= 0 &&
        verticalSeparation >= 0 &&
        verticalSeparation <= lineLength,
    );
    return {
      horizontalReach: Math.sqrt(
        (lineLength - verticalSeparation) * (lineLength + verticalSeparation),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lineLength: 50, verticalSeparation: 30 },
  output: { horizontalReach: 40 },
} satisfies ToolExample<Input, Output>;
export const anchorHorizontalScopeProjectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/anchor-horizontal-scope-projection",
    title: "Anchor Horizontal Scope Projection Tool",
    description:
      "Return the straight taut-line geometric reach, excluding catenary shape and anchoring recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineLength: { type: "number", minimum: 0 },
        verticalSeparation: { type: "number", minimum: 0 },
      },
      required: ["lineLength", "verticalSeparation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { horizontalReach: { type: "number" } },
      required: ["horizontalReach"],
    },
    ports: {
      inputs: [
        {
          id: "lineLength",
          label: "Line Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "verticalSeparation",
          label: "Vertical Separation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontalReach",
          label: "Horizontal Reach",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = anchorHorizontalScopeProjectionTool.execute;
export default anchorHorizontalScopeProjectionTool;
