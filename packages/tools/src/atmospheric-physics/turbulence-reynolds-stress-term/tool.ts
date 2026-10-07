import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly densityKgPerCubicMeter: number;
  readonly firstVelocityFluctuation: number;
  readonly secondVelocityFluctuation: number;
};
export type Output = { readonly instantaneousStressTermPa: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    densityKgPerCubicMeter: { type: "number", minimum: 0 },
    firstVelocityFluctuation: { type: "number" },
    secondVelocityFluctuation: { type: "number" },
  },
  required: [
    "densityKgPerCubicMeter",
    "firstVelocityFluctuation",
    "secondVelocityFluctuation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { instantaneousStressTermPa: { type: "number" } },
  required: ["instantaneousStressTermPa"],
} as const;
/** Return one instantaneous contribution -rho*u′*v′ to the kinematic Reynolds-stress average using signed velocity fluctuations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    densityKgPerCubicMeter,
    firstVelocityFluctuation,
    secondVelocityFluctuation,
  } = request;
  const compute = (): Output => {
    H.domain(densityKgPerCubicMeter >= 0, "densityKgPerCubicMeter");
    return {
      instantaneousStressTermPa:
        -densityKgPerCubicMeter *
        firstVelocityFluctuation *
        secondVelocityFluctuation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    densityKgPerCubicMeter: 1.2,
    firstVelocityFluctuation: 2,
    secondVelocityFluctuation: -0.5,
  },
  output: { instantaneousStressTermPa: 1.2 },
} satisfies ToolExample<Input, Output>;
export const turbulenceReynoldsStressTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-physics", "atmospheric physics", "physics"],
      keywords: ["atmospheric physics", "physics"],
    },
    id: "atmospheric-physics/turbulence-reynolds-stress-term",
    title: "Turbulence Reynolds Stress Term",
    description:
      "Return one instantaneous contribution -rho*u′*v′ to the kinematic Reynolds-stress average using signed velocity fluctuations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        densityKgPerCubicMeter: { type: "number", minimum: 0 },
        firstVelocityFluctuation: { type: "number" },
        secondVelocityFluctuation: { type: "number" },
      },
      required: [
        "densityKgPerCubicMeter",
        "firstVelocityFluctuation",
        "secondVelocityFluctuation",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { instantaneousStressTermPa: { type: "number" } },
      required: ["instantaneousStressTermPa"],
    },
    ports: {
      inputs: [
        {
          id: "densityKgPerCubicMeter",
          label: "Density Kg Per Cubic Meter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstVelocityFluctuation",
          label: "First Velocity Fluctuation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondVelocityFluctuation",
          label: "Second Velocity Fluctuation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "instantaneousStressTermPa",
          label: "Instantaneous Stress Term Pa",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = turbulenceReynoldsStressTermTool.execute;
export default turbulenceReynoldsStressTermTool;
