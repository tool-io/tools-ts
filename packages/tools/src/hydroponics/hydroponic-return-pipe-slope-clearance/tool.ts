import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly run: number;
  readonly slope: number;
  readonly startingHeight: number;
  readonly obstacleHeight: number;
  readonly pipeRadius: number;
};
export type Output = {
  readonly endCenterHeight: number;
  readonly clearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    run: { type: "number", minimum: 0 },
    slope: { type: "number" },
    startingHeight: { type: "number" },
    obstacleHeight: { type: "number" },
    pipeRadius: { type: "number", minimum: 0 },
  },
  required: ["run", "slope", "startingHeight", "obstacleHeight", "pipeRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endCenterHeight: { type: "number" },
    clearance: { type: "number" },
  },
  required: ["endCenterHeight", "clearance"],
} as const;
/** Geometric clearance from supplied dimensions, without a drainage or code determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { run, slope, startingHeight, obstacleHeight, pipeRadius } = request;
  const compute = (): Output => {
    H.domain(run >= 0 && pipeRadius >= 0);
    return {
      endCenterHeight: startingHeight - run * slope,
      clearance: startingHeight - run * slope - pipeRadius - obstacleHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    run: 10,
    slope: 0.02,
    startingHeight: 1,
    obstacleHeight: 0.5,
    pipeRadius: 0.05,
  },
  output: { endCenterHeight: 0.8, clearance: 0.25 },
} satisfies ToolExample<Input, Output>;
export const hydroponicReturnPipeSlopeClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/hydroponic-return-pipe-slope-clearance",
    title: "Hydroponic Return Pipe Slope Clearance Tool",
    description:
      "Geometric clearance from supplied dimensions, without a drainage or code determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        run: { type: "number", minimum: 0 },
        slope: { type: "number" },
        startingHeight: { type: "number" },
        obstacleHeight: { type: "number" },
        pipeRadius: { type: "number", minimum: 0 },
      },
      required: [
        "run",
        "slope",
        "startingHeight",
        "obstacleHeight",
        "pipeRadius",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endCenterHeight: { type: "number" },
        clearance: { type: "number" },
      },
      required: ["endCenterHeight", "clearance"],
    },
    ports: {
      inputs: [
        {
          id: "run",
          label: "Run",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startingHeight",
          label: "Starting Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "obstacleHeight",
          label: "Obstacle Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pipeRadius",
          label: "Pipe Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "endCenterHeight",
          label: "End Center Height",
          valueType: { type: "number" },
        },
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hydroponicReturnPipeSlopeClearanceTool.execute;
export default hydroponicReturnPipeSlopeClearanceTool;
