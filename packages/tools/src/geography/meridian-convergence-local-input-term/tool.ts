import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly longitudeDifferenceRadians: number;
  readonly latitudeRadians: number;
};
export type Output = { readonly convergenceRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longitudeDifferenceRadians: { type: "number" },
    latitudeRadians: { type: "number" },
  },
  required: ["longitudeDifferenceRadians", "latitudeRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convergenceRadians: { type: "number" } },
  required: ["convergenceRadians"],
} as const;
/** Return the spherical transverse-Mercator meridian convergence on the stated central-meridian branch. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { longitudeDifferenceRadians, latitudeRadians } = request;
  const compute = (): Output => {
    H.domain(
      Math.abs(latitudeRadians) <= Math.PI / 2 &&
        Math.abs(longitudeDifferenceRadians) <= Math.PI / 2,
    );
    return {
      convergenceRadians: Math.atan(
        Math.tan(longitudeDifferenceRadians) * Math.sin(latitudeRadians),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    longitudeDifferenceRadians: 0.7853981633974483,
    latitudeRadians: 1.5707963267948966,
  },
  output: { convergenceRadians: 0.7853981633974483 },
} satisfies ToolExample<Input, Output>;
export const meridianConvergenceLocalInputTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/meridian-convergence-local-input-term",
    title: "Meridian Convergence Local Input Term Tool",
    description:
      "Return the spherical transverse-Mercator meridian convergence on the stated central-meridian branch.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longitudeDifferenceRadians: { type: "number" },
        latitudeRadians: { type: "number" },
      },
      required: ["longitudeDifferenceRadians", "latitudeRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convergenceRadians: { type: "number" } },
      required: ["convergenceRadians"],
    },
    ports: {
      inputs: [
        {
          id: "longitudeDifferenceRadians",
          label: "Longitude Difference Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latitudeRadians",
          label: "Latitude Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convergenceRadians",
          label: "Convergence Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = meridianConvergenceLocalInputTermTool.execute;
export default meridianConvergenceLocalInputTermTool;
