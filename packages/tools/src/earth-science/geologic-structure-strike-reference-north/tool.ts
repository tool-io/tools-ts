import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly strikeDegrees: number;
  readonly suppliedNorthReferenceOffsetDegrees: number;
};
export type Output = { readonly referencedStrikeDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strikeDegrees: { type: "number" },
    suppliedNorthReferenceOffsetDegrees: { type: "number" },
  },
  required: ["strikeDegrees", "suppliedNorthReferenceOffsetDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referencedStrikeDegrees: { type: "number" } },
  required: ["referencedStrikeDegrees"],
} as const;
/** Apply an explicit clockwise-positive north-reference offset to a directed strike bearing and wrap [0,360), without resolving undirected strike or magnetic models. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strikeDegrees, suppliedNorthReferenceOffsetDegrees } = request;
  const compute = (): Output => {
    return (() => {
      const raw =
        (strikeDegrees % 360) + (suppliedNorthReferenceOffsetDegrees % 360);
      return { referencedStrikeDegrees: ((raw % 360) + 360) % 360 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { strikeDegrees: 350, suppliedNorthReferenceOffsetDegrees: 20 },
  output: { referencedStrikeDegrees: 10 },
} satisfies ToolExample<Input, Output>;
export const geologicStructureStrikeReferenceNorthTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/geologic-structure-strike-reference-north",
      title: "Geologic Structure Strike Reference North Tool",
      description:
        "Apply an explicit clockwise-positive north-reference offset to a directed strike bearing and wrap [0,360), without resolving undirected strike or magnetic models.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          strikeDegrees: { type: "number" },
          suppliedNorthReferenceOffsetDegrees: { type: "number" },
        },
        required: ["strikeDegrees", "suppliedNorthReferenceOffsetDegrees"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { referencedStrikeDegrees: { type: "number" } },
        required: ["referencedStrikeDegrees"],
      },
      ports: {
        inputs: [
          {
            id: "strikeDegrees",
            label: "Strike Degrees",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedNorthReferenceOffsetDegrees",
            label: "Supplied North Reference Offset Degrees",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "referencedStrikeDegrees",
            label: "Referenced Strike Degrees",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geologicStructureStrikeReferenceNorthTool.execute;
export default geologicStructureStrikeReferenceNorthTool;
