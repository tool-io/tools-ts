import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly staticHead: number;
  readonly frictionHead: number;
  readonly otherHead: number;
  readonly flow: number;
  readonly density: number;
  readonly gravity: number;
  readonly efficiency: number;
};
export type Output = {
  readonly totalHead: number;
  readonly hydraulicPower: number;
  readonly inputPower: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    staticHead: { type: "number", minimum: 0 },
    frictionHead: { type: "number", minimum: 0 },
    otherHead: { type: "number", minimum: 0 },
    flow: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: [
    "staticHead",
    "frictionHead",
    "otherHead",
    "flow",
    "density",
    "gravity",
    "efficiency",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalHead: { type: "number" },
    hydraulicPower: { type: "number" },
    inputPower: { type: "number" },
  },
  required: ["totalHead", "hydraulicPower", "inputPower"],
} as const;
/** SI steady-flow pump power with explicit losses and efficiency, without selecting a pump or operating limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    staticHead,
    frictionHead,
    otherHead,
    flow,
    density,
    gravity,
    efficiency,
  } = request;
  const compute = (): Output => {
    H.domain(
      staticHead >= 0 &&
        frictionHead >= 0 &&
        otherHead >= 0 &&
        flow >= 0 &&
        efficiency > 0 &&
        efficiency <= 1,
    );
    H.positive(density);
    H.positive(gravity);
    return {
      totalHead: staticHead + frictionHead + otherHead,
      hydraulicPower:
        density * gravity * flow * (staticHead + frictionHead + otherHead),
      inputPower:
        (density * gravity * flow * (staticHead + frictionHead + otherHead)) /
        efficiency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    staticHead: 2,
    frictionHead: 1,
    otherHead: 1,
    flow: 0.01,
    density: 1000,
    gravity: 10,
    efficiency: 0.5,
  },
  output: { totalHead: 4, hydraulicPower: 400, inputPower: 800 },
} satisfies ToolExample<Input, Output>;
export const aquaculturePumpHeadLossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/aquaculture-pump-head-loss-term",
    title: "Aquaculture Pump Head Loss Term Tool",
    description:
      "SI steady-flow pump power with explicit losses and efficiency, without selecting a pump or operating limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        staticHead: { type: "number", minimum: 0 },
        frictionHead: { type: "number", minimum: 0 },
        otherHead: { type: "number", minimum: 0 },
        flow: { type: "number", minimum: 0 },
        density: { type: "number", exclusiveMinimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
        efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: [
        "staticHead",
        "frictionHead",
        "otherHead",
        "flow",
        "density",
        "gravity",
        "efficiency",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalHead: { type: "number" },
        hydraulicPower: { type: "number" },
        inputPower: { type: "number" },
      },
      required: ["totalHead", "hydraulicPower", "inputPower"],
    },
    ports: {
      inputs: [
        {
          id: "staticHead",
          label: "Static Head",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frictionHead",
          label: "Friction Head",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherHead",
          label: "Other Head",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flow",
          label: "Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "density",
          label: "Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "efficiency",
          label: "Efficiency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalHead", label: "Total Head", valueType: { type: "number" } },
        {
          id: "hydraulicPower",
          label: "Hydraulic Power",
          valueType: { type: "number" },
        },
        {
          id: "inputPower",
          label: "Input Power",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaculturePumpHeadLossTermTool.execute;
export default aquaculturePumpHeadLossTermTool;
