import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pipeLength: number;
  readonly flowVelocity: number;
  readonly settlingDepth: number;
  readonly settlingVelocity: number;
};
export type Output = {
  readonly travelTime: number;
  readonly settlingTime: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pipeLength: { type: "number", minimum: 0 },
    flowVelocity: { type: "number", exclusiveMinimum: 0 },
    settlingDepth: { type: "number", minimum: 0 },
    settlingVelocity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pipeLength", "flowVelocity", "settlingDepth", "settlingVelocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    travelTime: { type: "number" },
    settlingTime: { type: "number" },
    margin: { type: "number" },
  },
  required: ["travelTime", "settlingTime", "margin"],
} as const;
/** Compare constant advective transit and vertical settling times, excluding turbulence and resuspension. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pipeLength, flowVelocity, settlingDepth, settlingVelocity } = request;
  const compute = (): Output => {
    H.domain(pipeLength >= 0 && settlingDepth >= 0);
    H.positive(flowVelocity);
    H.positive(settlingVelocity);
    return {
      travelTime: pipeLength / flowVelocity,
      settlingTime: settlingDepth / settlingVelocity,
      margin: pipeLength / flowVelocity - settlingDepth / settlingVelocity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pipeLength: 100,
    flowVelocity: 2,
    settlingDepth: 1,
    settlingVelocity: 0.01,
  },
  output: { travelTime: 50, settlingTime: 100, margin: -50 },
} satisfies ToolExample<Input, Output>;
export const pipeSedimentSettlingTravelGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/pipe-sediment-settling-travel-gap",
    title: "Pipe Sediment Settling Travel Gap Tool",
    description:
      "Compare constant advective transit and vertical settling times, excluding turbulence and resuspension.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pipeLength: { type: "number", minimum: 0 },
        flowVelocity: { type: "number", exclusiveMinimum: 0 },
        settlingDepth: { type: "number", minimum: 0 },
        settlingVelocity: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "pipeLength",
        "flowVelocity",
        "settlingDepth",
        "settlingVelocity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        travelTime: { type: "number" },
        settlingTime: { type: "number" },
        margin: { type: "number" },
      },
      required: ["travelTime", "settlingTime", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "pipeLength",
          label: "Pipe Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flowVelocity",
          label: "Flow Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "settlingDepth",
          label: "Settling Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "settlingVelocity",
          label: "Settling Velocity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "travelTime",
          label: "Travel Time",
          valueType: { type: "number" },
        },
        {
          id: "settlingTime",
          label: "Settling Time",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pipeSedimentSettlingTravelGapTool.execute;
export default pipeSedimentSettlingTravelGapTool;
