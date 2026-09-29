import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly partHeights: readonly number[];
  readonly spacerHeights: readonly number[];
  readonly availableHeight: number;
};
export type Output = {
  readonly stackHeight: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partHeights: { type: "array", maxItems: 256, items: { type: "number" } },
    spacerHeights: { type: "array", maxItems: 256, items: { type: "number" } },
    availableHeight: { type: "number", minimum: 0 },
  },
  required: ["partHeights", "spacerHeights", "availableHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stackHeight: { type: "number" }, residual: { type: "number" } },
  required: ["stackHeight", "residual"],
} as const;
/** Calculate part stack height residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partHeights, spacerHeights, availableHeight } = request;
  const compute = (): Output => {
    H.domain(
      partHeights.every((x) => x >= 0) &&
        spacerHeights.every((x) => x >= 0) &&
        availableHeight >= 0,
    );
    return {
      stackHeight:
        partHeights.reduce((a, b) => a + b, 0) +
        spacerHeights.reduce((a, b) => a + b, 0),
      residual:
        availableHeight -
        partHeights.reduce((a, b) => a + b, 0) -
        spacerHeights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    partHeights: [2, 3, 4],
    spacerHeights: [0.5, 0.5],
    availableHeight: 12,
  },
  output: { stackHeight: 10, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const partStackHeightResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/part-stack-height-residual",
    title: "Part Stack Height Residual Tool",
    description:
      "Calculate part stack height residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        spacerHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        availableHeight: { type: "number", minimum: 0 },
      },
      required: ["partHeights", "spacerHeights", "availableHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stackHeight: { type: "number" },
        residual: { type: "number" },
      },
      required: ["stackHeight", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "partHeights",
          label: "Part Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "spacerHeights",
          label: "Spacer Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "availableHeight",
          label: "Available Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stackHeight",
          label: "Stack Height",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = partStackHeightResidualTool.execute;
export default partStackHeightResidualTool;
