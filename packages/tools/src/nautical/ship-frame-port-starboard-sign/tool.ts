import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transverseCoordinate: number;
  readonly positiveIsStarboard: boolean;
};
export type Output = {
  readonly side: string;
  readonly signedStarboardCoordinate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transverseCoordinate: { type: "number" },
    positiveIsStarboard: { type: "boolean" },
  },
  required: ["transverseCoordinate", "positiveIsStarboard"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    side: { type: "string", maxLength: 8192 },
    signedStarboardCoordinate: { type: "number" },
  },
  required: ["side", "signedStarboardCoordinate"],
} as const;
/** Classify an explicit transverse coordinate under its supplied ship-frame sign convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transverseCoordinate, positiveIsStarboard } = request;
  const compute = (): Output => {
    return {
      side:
        transverseCoordinate === 0
          ? "centerline"
          : transverseCoordinate > 0 === positiveIsStarboard
            ? "starboard"
            : "port",
      signedStarboardCoordinate:
        transverseCoordinate * (positiveIsStarboard ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transverseCoordinate: 2, positiveIsStarboard: true },
  output: { side: "starboard", signedStarboardCoordinate: 2 },
} satisfies ToolExample<Input, Output>;
export const shipFramePortStarboardSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/ship-frame-port-starboard-sign",
    title: "Ship Frame Port Starboard Sign Tool",
    description:
      "Classify an explicit transverse coordinate under its supplied ship-frame sign convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transverseCoordinate: { type: "number" },
        positiveIsStarboard: { type: "boolean" },
      },
      required: ["transverseCoordinate", "positiveIsStarboard"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        side: { type: "string", maxLength: 8192 },
        signedStarboardCoordinate: { type: "number" },
      },
      required: ["side", "signedStarboardCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "transverseCoordinate",
          label: "Transverse Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveIsStarboard",
          label: "Positive Is Starboard",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "side", label: "Side", valueType: { type: "string" } },
        {
          id: "signedStarboardCoordinate",
          label: "Signed Starboard Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shipFramePortStarboardSignTool.execute;
export default shipFramePortStarboardSignTool;
