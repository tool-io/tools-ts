import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowArea: number;
  readonly windowNormalCosine: number;
  readonly wallArea: number;
  readonly wallNormalCosine: number;
};
export type Output = {
  readonly projectedWindow: number;
  readonly projectedWall: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowArea: { type: "number", minimum: 0 },
    windowNormalCosine: { type: "number" },
    wallArea: { type: "number", exclusiveMinimum: 0 },
    wallNormalCosine: { type: "number" },
  },
  required: [
    "windowArea",
    "windowNormalCosine",
    "wallArea",
    "wallNormalCosine",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectedWindow: { type: "number" },
    projectedWall: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["projectedWindow", "projectedWall", "ratio"],
} as const;
/** Compare orthogonal projected areas under supplied direction cosines; no building-code check. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windowArea, windowNormalCosine, wallArea, wallNormalCosine } =
    request;
  const compute = (): Output => {
    H.domain(windowArea >= 0 && windowArea <= wallArea);
    H.positive(wallArea);
    H.domain(
      Math.abs(windowNormalCosine) <= 1 &&
        Math.abs(wallNormalCosine) <= 1 &&
        wallNormalCosine !== 0,
    );
    return {
      projectedWindow: windowArea * Math.abs(windowNormalCosine),
      projectedWall: wallArea * Math.abs(wallNormalCosine),
      ratio:
        (windowArea / wallArea) *
        (Math.abs(windowNormalCosine) / Math.abs(wallNormalCosine)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    windowArea: 4,
    windowNormalCosine: 0.5,
    wallArea: 20,
    wallNormalCosine: 1,
  },
  output: { projectedWindow: 2, projectedWall: 20, ratio: 0.1 },
} satisfies ToolExample<Input, Output>;
export const windowWallProjectionRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/window-wall-projection-ratio",
    title: "Window Wall Projection Ratio Tool",
    description:
      "Compare orthogonal projected areas under supplied direction cosines; no building-code check.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowArea: { type: "number", minimum: 0 },
        windowNormalCosine: { type: "number" },
        wallArea: { type: "number", exclusiveMinimum: 0 },
        wallNormalCosine: { type: "number" },
      },
      required: [
        "windowArea",
        "windowNormalCosine",
        "wallArea",
        "wallNormalCosine",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        projectedWindow: { type: "number" },
        projectedWall: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["projectedWindow", "projectedWall", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "windowArea",
          label: "Window Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowNormalCosine",
          label: "Window Normal Cosine",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wallArea",
          label: "Wall Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wallNormalCosine",
          label: "Wall Normal Cosine",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "projectedWindow",
          label: "Projected Window",
          valueType: { type: "number" },
        },
        {
          id: "projectedWall",
          label: "Projected Wall",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = windowWallProjectionRatioTool.execute;
export default windowWallProjectionRatioTool;
