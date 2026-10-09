import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAngleDegrees: number;
  readonly secondAngleDegrees: number;
};
export type Output = { readonly smallestSeparationDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAngleDegrees: { type: "number" },
    secondAngleDegrees: { type: "number" },
  },
  required: ["firstAngleDegrees", "secondAngleDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { smallestSeparationDegrees: { type: "number" } },
  required: ["smallestSeparationDegrees"],
} as const;
/** Report the smallest undirected line-angle separation modulo 180 degrees for two supplied halftone screen angles. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAngleDegrees, secondAngleDegrees } = request;
  const compute = (): Output => {
    return (() => {
      const difference = (secondAngleDegrees % 180) - (firstAngleDegrees % 180);
      return {
        smallestSeparationDegrees: Math.abs(
          ((((difference + 90) % 180) + 180) % 180) - 90,
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAngleDegrees: 15, secondAngleDegrees: 75 },
  output: { smallestSeparationDegrees: 60 },
} satisfies ToolExample<Input, Output>;
export const halftoneScreenAngleSeparationPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/halftone-screen-angle-separation-pair",
    title: "Halftone Screen Angle Separation Pair Tool",
    description:
      "Report the smallest undirected line-angle separation modulo 180 degrees for two supplied halftone screen angles.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAngleDegrees: { type: "number" },
        secondAngleDegrees: { type: "number" },
      },
      required: ["firstAngleDegrees", "secondAngleDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { smallestSeparationDegrees: { type: "number" } },
      required: ["smallestSeparationDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "firstAngleDegrees",
          label: "First Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAngleDegrees",
          label: "Second Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "smallestSeparationDegrees",
          label: "Smallest Separation Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = halftoneScreenAngleSeparationPairTool.execute;
export default halftoneScreenAngleSeparationPairTool;
