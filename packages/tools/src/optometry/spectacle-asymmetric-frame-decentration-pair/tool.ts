import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameCenterDistance: number;
  readonly rightMonocularDistance: number;
  readonly leftMonocularDistance: number;
  readonly effectiveDiameter: number;
};
export type Output = {
  readonly rightDecentration: number;
  readonly leftDecentration: number;
  readonly nominalBlankDiameter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameCenterDistance: { type: "number", minimum: 0 },
    rightMonocularDistance: { type: "number", minimum: 0 },
    leftMonocularDistance: { type: "number", minimum: 0 },
    effectiveDiameter: { type: "number", minimum: 0 },
  },
  required: [
    "frameCenterDistance",
    "rightMonocularDistance",
    "leftMonocularDistance",
    "effectiveDiameter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rightDecentration: { type: "number" },
    leftDecentration: { type: "number" },
    nominalBlankDiameter: { type: "number" },
  },
  required: ["rightDecentration", "leftDecentration", "nominalBlankDiameter"],
} as const;
/** Explicit planar model decentration and conservative circular-blank budget, without selecting spectacle fitting measurements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    frameCenterDistance,
    rightMonocularDistance,
    leftMonocularDistance,
    effectiveDiameter,
  } = request;
  const compute = (): Output => {
    H.domain(
      frameCenterDistance >= 0 &&
        rightMonocularDistance >= 0 &&
        leftMonocularDistance >= 0 &&
        effectiveDiameter >= 0,
    );
    return {
      rightDecentration: frameCenterDistance / 2 - rightMonocularDistance,
      leftDecentration: frameCenterDistance / 2 - leftMonocularDistance,
      nominalBlankDiameter:
        effectiveDiameter +
        2 *
          Math.max(
            Math.abs(frameCenterDistance / 2 - rightMonocularDistance),
            Math.abs(frameCenterDistance / 2 - leftMonocularDistance),
          ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frameCenterDistance: 70,
    rightMonocularDistance: 32,
    leftMonocularDistance: 30,
    effectiveDiameter: 50,
  },
  output: {
    rightDecentration: 3,
    leftDecentration: 5,
    nominalBlankDiameter: 60,
  },
} satisfies ToolExample<Input, Output>;
export const spectacleAsymmetricFrameDecentrationPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "optometry/spectacle-asymmetric-frame-decentration-pair",
      title: "Spectacle Asymmetric Frame Decentration Pair Tool",
      description:
        "Explicit planar model decentration and conservative circular-blank budget, without selecting spectacle fitting measurements.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          frameCenterDistance: { type: "number", minimum: 0 },
          rightMonocularDistance: { type: "number", minimum: 0 },
          leftMonocularDistance: { type: "number", minimum: 0 },
          effectiveDiameter: { type: "number", minimum: 0 },
        },
        required: [
          "frameCenterDistance",
          "rightMonocularDistance",
          "leftMonocularDistance",
          "effectiveDiameter",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rightDecentration: { type: "number" },
          leftDecentration: { type: "number" },
          nominalBlankDiameter: { type: "number" },
        },
        required: [
          "rightDecentration",
          "leftDecentration",
          "nominalBlankDiameter",
        ],
      },
      ports: {
        inputs: [
          {
            id: "frameCenterDistance",
            label: "Frame Center Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rightMonocularDistance",
            label: "Right Monocular Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "leftMonocularDistance",
            label: "Left Monocular Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "effectiveDiameter",
            label: "Effective Diameter",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "rightDecentration",
            label: "Right Decentration",
            valueType: { type: "number" },
          },
          {
            id: "leftDecentration",
            label: "Left Decentration",
            valueType: { type: "number" },
          },
          {
            id: "nominalBlankDiameter",
            label: "Nominal Blank Diameter",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = spectacleAsymmetricFrameDecentrationPairTool.execute;
export default spectacleAsymmetricFrameDecentrationPairTool;
