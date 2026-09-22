import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slopingLength: number;
  readonly pitchRadians: number;
};
export type Output = { readonly horizontal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slopingLength: { type: "number", minimum: 0 },
    pitchRadians: { type: "number", minimum: 0 },
  },
  required: ["slopingLength", "pitchRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { horizontal: { type: "number" } },
  required: ["horizontal"],
} as const;
/** Calculate pitched roof eave horizontal projection from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slopingLength, pitchRadians } = request;
  const compute = (): Output => {
    H.domain(
      slopingLength >= 0 && pitchRadians >= 0 && pitchRadians < Math.PI / 2,
    );
    return { horizontal: slopingLength * Math.cos(pitchRadians) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slopingLength: 4, pitchRadians: 1.0471975511965976 },
  output: { horizontal: 2.0000000000000004 },
} satisfies ToolExample<Input, Output>;
export const pitchedRoofEaveHorizontalProjectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "architecture/pitched-roof-eave-horizontal-projection",
      title: "Pitched Roof Eave Horizontal Projection Tool",
      description:
        "Calculate pitched roof eave horizontal projection from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          slopingLength: { type: "number", minimum: 0 },
          pitchRadians: { type: "number", minimum: 0 },
        },
        required: ["slopingLength", "pitchRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { horizontal: { type: "number" } },
        required: ["horizontal"],
      },
      ports: {
        inputs: [
          {
            id: "slopingLength",
            label: "Sloping Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pitchRadians",
            label: "Pitch Radians",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "horizontal",
            label: "Horizontal",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pitchedRoofEaveHorizontalProjectionTool.execute;
export default pitchedRoofEaveHorizontalProjectionTool;
