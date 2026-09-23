import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly design: readonly number[];
  readonly measured: readonly number[];
};
export type Output = {
  readonly scaleRatios: readonly number[];
  readonly residuals: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    design: { type: "array", maxItems: 256, items: { type: "number" } },
    measured: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["design", "measured"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleRatios: { type: "array", maxItems: 256, items: { type: "number" } },
    residuals: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["scaleRatios", "residuals"],
} as const;
/** Calculate scaffold design measured scale gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { design, measured } = request;
  const compute = (): Output => {
    H.sameLength(design, measured);
    H.domain(design.every((x) => x > 0) && measured.every((x) => x >= 0));
    return {
      scaleRatios: measured.map((x, i) => x / design[i]),
      residuals: measured.map((x, i) => x - design[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { design: [10, 20], measured: [9, 22] },
  output: { scaleRatios: [0.9, 1.1], residuals: [-1, 2] },
} satisfies ToolExample<Input, Output>;
export const scaffoldDesignMeasuredScaleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/scaffold-design-measured-scale-gap",
    title: "Scaffold Design Measured Scale Gap Tool",
    description:
      "Calculate scaffold design measured scale gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        design: { type: "array", maxItems: 256, items: { type: "number" } },
        measured: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["design", "measured"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleRatios: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        residuals: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["scaleRatios", "residuals"],
    },
    ports: {
      inputs: [
        {
          id: "design",
          label: "Design",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "scaleRatios",
          label: "Scale Ratios",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "residuals",
          label: "Residuals",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldDesignMeasuredScaleGapTool.execute;
export default scaffoldDesignMeasuredScaleGapTool;
