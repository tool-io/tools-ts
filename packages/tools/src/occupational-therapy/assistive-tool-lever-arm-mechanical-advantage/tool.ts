import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effortArm: number;
  readonly loadArm: number;
  readonly efficiency: number;
  readonly inputForce: number;
};
export type Output = {
  readonly idealAdvantage: number;
  readonly effectiveAdvantage: number;
  readonly outputForce: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effortArm: { type: "number", exclusiveMinimum: 0 },
    loadArm: { type: "number", exclusiveMinimum: 0 },
    efficiency: { type: "number", minimum: 0, maximum: 1 },
    inputForce: { type: "number", minimum: 0 },
  },
  required: ["effortArm", "loadArm", "efficiency", "inputForce"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idealAdvantage: { type: "number" },
    effectiveAdvantage: { type: "number" },
    outputForce: { type: "number" },
  },
  required: ["idealAdvantage", "effectiveAdvantage", "outputForce"],
} as const;
/** Assistive-tool bench lever arithmetic with supplied efficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effortArm, loadArm, efficiency, inputForce } = request;
  const compute = (): Output => {
    H.positive(effortArm);
    H.positive(loadArm);
    H.domain(efficiency >= 0 && efficiency <= 1 && inputForce >= 0);
    return {
      idealAdvantage: effortArm / loadArm,
      effectiveAdvantage: (effortArm * efficiency) / loadArm,
      outputForce: (inputForce * effortArm * efficiency) / loadArm,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effortArm: 20, loadArm: 5, efficiency: 0.8, inputForce: 10 },
  output: { idealAdvantage: 4, effectiveAdvantage: 3.2, outputForce: 32 },
} satisfies ToolExample<Input, Output>;
export const assistiveToolLeverArmMechanicalAdvantageTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "occupational-therapy/assistive-tool-lever-arm-mechanical-advantage",
      title: "Assistive Tool Lever Arm Mechanical Advantage Tool",
      description:
        "Assistive-tool bench lever arithmetic with supplied efficiency.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effortArm: { type: "number", exclusiveMinimum: 0 },
          loadArm: { type: "number", exclusiveMinimum: 0 },
          efficiency: { type: "number", minimum: 0, maximum: 1 },
          inputForce: { type: "number", minimum: 0 },
        },
        required: ["effortArm", "loadArm", "efficiency", "inputForce"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          idealAdvantage: { type: "number" },
          effectiveAdvantage: { type: "number" },
          outputForce: { type: "number" },
        },
        required: ["idealAdvantage", "effectiveAdvantage", "outputForce"],
      },
      ports: {
        inputs: [
          {
            id: "effortArm",
            label: "Effort Arm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "loadArm",
            label: "Load Arm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "efficiency",
            label: "Efficiency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inputForce",
            label: "Input Force",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "idealAdvantage",
            label: "Ideal Advantage",
            valueType: { type: "number" },
          },
          {
            id: "effectiveAdvantage",
            label: "Effective Advantage",
            valueType: { type: "number" },
          },
          {
            id: "outputForce",
            label: "Output Force",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = assistiveToolLeverArmMechanicalAdvantageTool.execute;
export default assistiveToolLeverArmMechanicalAdvantageTool;
