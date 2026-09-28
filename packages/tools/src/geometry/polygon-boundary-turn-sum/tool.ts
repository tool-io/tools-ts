import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly signedTurnsRadians: readonly number[] };
export type Output = {
  readonly turnSumRadians: number;
  readonly winding: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedTurnsRadians: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["signedTurnsRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turnSumRadians: { type: "number" },
    winding: { type: "number" },
  },
  required: ["turnSumRadians", "winding"],
} as const;
/** Sum explicitly supplied signed exterior turns; this does not validate a polygon or round winding to an integer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedTurnsRadians } = request;
  const compute = (): Output => {
    return {
      turnSumRadians: signedTurnsRadians.reduce((a, b) => a + b, 0),
      winding: signedTurnsRadians.reduce((a, b) => a + b, 0) / (2 * Math.PI),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signedTurnsRadians: [
      1.5707963267948966, 1.5707963267948966, 1.5707963267948966,
      1.5707963267948966,
    ],
  },
  output: { turnSumRadians: 6.283185307179586, winding: 1 },
} satisfies ToolExample<Input, Output>;
export const polygonBoundaryTurnSumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/polygon-boundary-turn-sum",
    title: "Polygon Boundary Turn Sum Tool",
    description:
      "Sum explicitly supplied signed exterior turns; this does not validate a polygon or round winding to an integer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedTurnsRadians: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["signedTurnsRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        turnSumRadians: { type: "number" },
        winding: { type: "number" },
      },
      required: ["turnSumRadians", "winding"],
    },
    ports: {
      inputs: [
        {
          id: "signedTurnsRadians",
          label: "Signed Turns Radians",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "turnSumRadians",
          label: "Turn Sum Radians",
          valueType: { type: "number" },
        },
        { id: "winding", label: "Winding", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = polygonBoundaryTurnSumTool.execute;
export default polygonBoundaryTurnSumTool;
