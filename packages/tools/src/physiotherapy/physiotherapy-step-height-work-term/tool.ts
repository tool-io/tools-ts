import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massKg: number;
  readonly heightMeters: number;
  readonly steps: number;
  readonly gravity: number;
  readonly efficiency: number;
};
export type Output = {
  readonly mechanicalJ: number;
  readonly modeledInputJ: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massKg: { type: "number", minimum: 0 },
    heightMeters: { type: "number", minimum: 0 },
    steps: { type: "integer", minimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["massKg", "heightMeters", "steps", "gravity", "efficiency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mechanicalJ: { type: "number" },
    modeledInputJ: { type: "number" },
  },
  required: ["mechanicalJ", "modeledInputJ"],
} as const;
/** Ideal supplied step-lifting work with an explicit conversion efficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massKg, heightMeters, steps, gravity, efficiency } = request;
  const compute = (): Output => {
    H.domain(massKg >= 0 && heightMeters >= 0);
    H.integer(steps, 0);
    H.positive(gravity);
    H.domain(efficiency > 0 && efficiency <= 1);
    return {
      mechanicalJ: massKg * gravity * heightMeters * steps,
      modeledInputJ: (massKg * gravity * heightMeters * steps) / efficiency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    massKg: 70,
    heightMeters: 0.2,
    steps: 10,
    gravity: 9.8,
    efficiency: 0.25,
  },
  output: { mechanicalJ: 1372.0000000000002, modeledInputJ: 5488.000000000001 },
} satisfies ToolExample<Input, Output>;
export const physiotherapyStepHeightWorkTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/physiotherapy-step-height-work-term",
    title: "Physiotherapy Step Height Work Term Tool",
    description:
      "Ideal supplied step-lifting work with an explicit conversion efficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massKg: { type: "number", minimum: 0 },
        heightMeters: { type: "number", minimum: 0 },
        steps: { type: "integer", minimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
        efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["massKg", "heightMeters", "steps", "gravity", "efficiency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mechanicalJ: { type: "number" },
        modeledInputJ: { type: "number" },
      },
      required: ["mechanicalJ", "modeledInputJ"],
    },
    ports: {
      inputs: [
        {
          id: "massKg",
          label: "Mass Kg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heightMeters",
          label: "Height Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "steps",
          label: "Steps",
          required: true,
          valueType: { type: "integer" },
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
        {
          id: "mechanicalJ",
          label: "Mechanical J",
          valueType: { type: "number" },
        },
        {
          id: "modeledInputJ",
          label: "Modeled Input J",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = physiotherapyStepHeightWorkTermTool.execute;
export default physiotherapyStepHeightWorkTermTool;
