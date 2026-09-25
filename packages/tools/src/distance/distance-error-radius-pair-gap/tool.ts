import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerDistance: number;
  readonly firstErrorRadius: number;
  readonly secondErrorRadius: number;
};
export type Output = {
  readonly minimumDistance: number;
  readonly maximumDistance: number;
  readonly separated: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerDistance: { type: "number", minimum: 0 },
    firstErrorRadius: { type: "number", minimum: 0 },
    secondErrorRadius: { type: "number", minimum: 0 },
  },
  required: ["centerDistance", "firstErrorRadius", "secondErrorRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumDistance: { type: "number" },
    maximumDistance: { type: "number" },
    separated: { type: "boolean" },
  },
  required: ["minimumDistance", "maximumDistance", "separated"],
} as const;
/** Calculate distance error radius pair gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerDistance, firstErrorRadius, secondErrorRadius } = request;
  const compute = (): Output => {
    H.domain(
      centerDistance >= 0 && firstErrorRadius >= 0 && secondErrorRadius >= 0,
    );
    return {
      minimumDistance: Math.max(
        0,
        centerDistance - firstErrorRadius - secondErrorRadius,
      ),
      maximumDistance: centerDistance + firstErrorRadius + secondErrorRadius,
      separated: centerDistance > firstErrorRadius + secondErrorRadius,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerDistance: 10, firstErrorRadius: 2, secondErrorRadius: 3 },
  output: { minimumDistance: 5, maximumDistance: 15, separated: true },
} satisfies ToolExample<Input, Output>;
export const distanceErrorRadiusPairGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/distance-error-radius-pair-gap",
    title: "Distance Error Radius Pair Gap Tool",
    description:
      "Calculate distance error radius pair gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerDistance: { type: "number", minimum: 0 },
        firstErrorRadius: { type: "number", minimum: 0 },
        secondErrorRadius: { type: "number", minimum: 0 },
      },
      required: ["centerDistance", "firstErrorRadius", "secondErrorRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumDistance: { type: "number" },
        maximumDistance: { type: "number" },
        separated: { type: "boolean" },
      },
      required: ["minimumDistance", "maximumDistance", "separated"],
    },
    ports: {
      inputs: [
        {
          id: "centerDistance",
          label: "Center Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstErrorRadius",
          label: "First Error Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondErrorRadius",
          label: "Second Error Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minimumDistance",
          label: "Minimum Distance",
          valueType: { type: "number" },
        },
        {
          id: "maximumDistance",
          label: "Maximum Distance",
          valueType: { type: "number" },
        },
        { id: "separated", label: "Separated", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = distanceErrorRadiusPairGapTool.execute;
export default distanceErrorRadiusPairGapTool;
