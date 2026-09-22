import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly depositionVelocity: number;
  readonly concentration: number;
  readonly area: number;
  readonly duration: number;
};
export type Output = {
  readonly arealFlux: number;
  readonly depositedAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depositionVelocity: { type: "number", minimum: 0 },
    concentration: { type: "number", minimum: 0 },
    area: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
  },
  required: ["depositionVelocity", "concentration", "area", "duration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arealFlux: { type: "number" },
    depositedAmount: { type: "number" },
  },
  required: ["arealFlux", "depositedAmount"],
} as const;
/** Calculate deposition velocity flux concentration term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depositionVelocity, concentration, area, duration } = request;
  const compute = (): Output => {
    H.domain(
      depositionVelocity >= 0 &&
        concentration >= 0 &&
        area >= 0 &&
        duration >= 0,
    );
    return {
      arealFlux: depositionVelocity * concentration,
      depositedAmount: depositionVelocity * concentration * area * duration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    depositionVelocity: 0.01,
    concentration: 20,
    area: 100,
    duration: 10,
  },
  output: { arealFlux: 0.2, depositedAmount: 200 },
} satisfies ToolExample<Input, Output>;
export const depositionVelocityFluxConcentrationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-chemistry/deposition-velocity-flux-concentration-term",
      title: "Deposition Velocity Flux Concentration Term Tool",
      description:
        "Calculate deposition velocity flux concentration term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          depositionVelocity: { type: "number", minimum: 0 },
          concentration: { type: "number", minimum: 0 },
          area: { type: "number", minimum: 0 },
          duration: { type: "number", minimum: 0 },
        },
        required: ["depositionVelocity", "concentration", "area", "duration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          arealFlux: { type: "number" },
          depositedAmount: { type: "number" },
        },
        required: ["arealFlux", "depositedAmount"],
      },
      ports: {
        inputs: [
          {
            id: "depositionVelocity",
            label: "Deposition Velocity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "concentration",
            label: "Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "duration",
            label: "Duration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "arealFlux",
            label: "Areal Flux",
            valueType: { type: "number" },
          },
          {
            id: "depositedAmount",
            label: "Deposited Amount",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = depositionVelocityFluxConcentrationTermTool.execute;
export default depositionVelocityFluxConcentrationTermTool;
