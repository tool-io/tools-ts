import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly archDistance: number;
  readonly side: string;
  readonly midlineOffset: number;
};
export type Output = { readonly signedCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    archDistance: { type: "number", minimum: 0 },
    side: { type: "string", maxLength: 8192, enum: ["left", "right"] },
    midlineOffset: { type: "number" },
  },
  required: ["archDistance", "side", "midlineOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCoordinate: { type: "number" } },
  required: ["signedCoordinate"],
} as const;
/** Caller-declared left-negative, right-positive arch coordinate relative to an explicit offset; no tooth-numbering or patient orientation inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { archDistance, side, midlineOffset } = request;
  const compute = (): Output => {
    H.domain(archDistance >= 0);
    H.domain(["left", "right"].includes(side));
    return {
      signedCoordinate:
        (side === "left" ? -archDistance : archDistance) + midlineOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { archDistance: 10, side: "left", midlineOffset: 2 },
  output: { signedCoordinate: -8 },
} satisfies ToolExample<Input, Output>;
export const toothPositionMidlineSignedCoordinateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anatomy/tooth-position-midline-signed-coordinate",
      title: "Tooth Position Midline Signed Coordinate Tool",
      description:
        "Caller-declared left-negative, right-positive arch coordinate relative to an explicit offset; no tooth-numbering or patient orientation inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          archDistance: { type: "number", minimum: 0 },
          side: { type: "string", maxLength: 8192, enum: ["left", "right"] },
          midlineOffset: { type: "number" },
        },
        required: ["archDistance", "side", "midlineOffset"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedCoordinate: { type: "number" } },
        required: ["signedCoordinate"],
      },
      ports: {
        inputs: [
          {
            id: "archDistance",
            label: "Arch Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "side",
            label: "Side",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "midlineOffset",
            label: "Midline Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedCoordinate",
            label: "Signed Coordinate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = toothPositionMidlineSignedCoordinateTool.execute;
export default toothPositionMidlineSignedCoordinateTool;
