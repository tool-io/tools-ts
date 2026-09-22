import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedLengthFactor: number;
  readonly sourceVolume: number;
};
export type Output = {
  readonly orientation: number;
  readonly reduced: boolean;
  readonly volumeMagnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedLengthFactor: { type: "number" },
    sourceVolume: { type: "number", minimum: 0 },
  },
  required: ["signedLengthFactor", "sourceVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orientation: { type: "integer" },
    reduced: { type: "boolean" },
    volumeMagnitude: { type: "number" },
  },
  required: ["orientation", "reduced", "volumeMagnitude"],
} as const;
/** Calculate sculpture reduction scale sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedLengthFactor, sourceVolume } = request;
  const compute = (): Output => {
    H.domain(signedLengthFactor !== 0 && sourceVolume >= 0);
    return {
      orientation: Math.sign(signedLengthFactor),
      reduced: Math.abs(signedLengthFactor) < 1,
      volumeMagnitude: sourceVolume * Math.abs(signedLengthFactor) ** 3,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedLengthFactor: -0.5, sourceVolume: 80 },
  output: { orientation: -1, reduced: true, volumeMagnitude: 10 },
} satisfies ToolExample<Input, Output>;
export const sculptureReductionScaleSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/sculpture-reduction-scale-sign",
    title: "Sculpture Reduction Scale Sign Tool",
    description:
      "Calculate sculpture reduction scale sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedLengthFactor: { type: "number" },
        sourceVolume: { type: "number", minimum: 0 },
      },
      required: ["signedLengthFactor", "sourceVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orientation: { type: "integer" },
        reduced: { type: "boolean" },
        volumeMagnitude: { type: "number" },
      },
      required: ["orientation", "reduced", "volumeMagnitude"],
    },
    ports: {
      inputs: [
        {
          id: "signedLengthFactor",
          label: "Signed Length Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceVolume",
          label: "Source Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "orientation",
          label: "Orientation",
          valueType: { type: "integer" },
        },
        { id: "reduced", label: "Reduced", valueType: { type: "boolean" } },
        {
          id: "volumeMagnitude",
          label: "Volume Magnitude",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sculptureReductionScaleSignTool.execute;
export default sculptureReductionScaleSignTool;
