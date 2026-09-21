import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAngleRadians: number;
  readonly secondAngleRadians: number;
  readonly targetAngleRadians: number;
};
export type Output = { readonly gapRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAngleRadians: { type: "number" },
    secondAngleRadians: { type: "number" },
    targetAngleRadians: { type: "number" },
  },
  required: ["firstAngleRadians", "secondAngleRadians", "targetAngleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gapRadians: { type: "number" } },
  required: ["gapRadians"],
} as const;
/** Calculate artifact refit two fragment angle gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAngleRadians, secondAngleRadians, targetAngleRadians } = request;
  const compute = (): Output => {
    return {
      gapRadians: targetAngleRadians - firstAngleRadians - secondAngleRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAngleRadians: 0.5,
    secondAngleRadians: 0.75,
    targetAngleRadians: 2,
  },
  output: { gapRadians: 0.75 },
} satisfies ToolExample<Input, Output>;
export const artifactRefitTwoFragmentAngleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/artifact-refit-two-fragment-angle-gap",
    title: "Artifact Refit Two Fragment Angle Gap Tool",
    description:
      "Calculate artifact refit two fragment angle gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAngleRadians: { type: "number" },
        secondAngleRadians: { type: "number" },
        targetAngleRadians: { type: "number" },
      },
      required: [
        "firstAngleRadians",
        "secondAngleRadians",
        "targetAngleRadians",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gapRadians: { type: "number" } },
      required: ["gapRadians"],
    },
    ports: {
      inputs: [
        {
          id: "firstAngleRadians",
          label: "First Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAngleRadians",
          label: "Second Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetAngleRadians",
          label: "Target Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gapRadians",
          label: "Gap Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artifactRefitTwoFragmentAngleGapTool.execute;
export default artifactRefitTwoFragmentAngleGapTool;
