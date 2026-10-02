import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceFlow: number;
  readonly pressure: number;
  readonly referencePressure: number;
  readonly speed: number;
  readonly referenceSpeed: number;
};
export type Output = {
  readonly benchFlow: number;
  readonly relativeAreaOutput: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceFlow: { type: "number", minimum: 0 },
    pressure: { type: "number", minimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
    speed: { type: "number", exclusiveMinimum: 0 },
    referenceSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "referenceFlow",
    "pressure",
    "referencePressure",
    "speed",
    "referenceSpeed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    benchFlow: { type: "number" },
    relativeAreaOutput: { type: "number" },
  },
  required: ["benchFlow", "relativeAreaOutput"],
} as const;
/** Ideal supplied orifice bench-flow scaling, without selecting field settings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceFlow, pressure, referencePressure, speed, referenceSpeed } =
    request;
  const compute = (): Output => {
    H.domain(referenceFlow >= 0 && pressure >= 0);
    H.positive(referencePressure);
    H.positive(speed);
    H.positive(referenceSpeed);
    return {
      benchFlow: referenceFlow * Math.sqrt(pressure / referencePressure),
      relativeAreaOutput:
        (Math.sqrt(pressure / referencePressure) * referenceSpeed) / speed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceFlow: 1,
    pressure: 4,
    referencePressure: 1,
    speed: 2,
    referenceSpeed: 2,
  },
  output: { benchFlow: 2, relativeAreaOutput: 2 },
} satisfies ToolExample<Input, Output>;
export const sprayBenchSpeedPressureFlowFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/spray-bench-speed-pressure-flow-factor",
    title: "Spray Bench Speed Pressure Flow Factor Tool",
    description:
      "Ideal supplied orifice bench-flow scaling, without selecting field settings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceFlow: { type: "number", minimum: 0 },
        pressure: { type: "number", minimum: 0 },
        referencePressure: { type: "number", exclusiveMinimum: 0 },
        speed: { type: "number", exclusiveMinimum: 0 },
        referenceSpeed: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "referenceFlow",
        "pressure",
        "referencePressure",
        "speed",
        "referenceSpeed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        benchFlow: { type: "number" },
        relativeAreaOutput: { type: "number" },
      },
      required: ["benchFlow", "relativeAreaOutput"],
    },
    ports: {
      inputs: [
        {
          id: "referenceFlow",
          label: "Reference Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pressure",
          label: "Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePressure",
          label: "Reference Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSpeed",
          label: "Reference Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "benchFlow", label: "Bench Flow", valueType: { type: "number" } },
        {
          id: "relativeAreaOutput",
          label: "Relative Area Output",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sprayBenchSpeedPressureFlowFactorTool.execute;
export default sprayBenchSpeedPressureFlowFactorTool;
