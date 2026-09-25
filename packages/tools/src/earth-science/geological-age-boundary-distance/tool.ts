import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageBeforePresent: number;
  readonly boundaryBeforePresent: number;
};
export type Output = {
  readonly signedDistance: number;
  readonly olderThanBoundary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageBeforePresent: { type: "number", minimum: 0 },
    boundaryBeforePresent: { type: "number", minimum: 0 },
  },
  required: ["ageBeforePresent", "boundaryBeforePresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDistance: { type: "number" },
    olderThanBoundary: { type: "boolean" },
  },
  required: ["signedDistance", "olderThanBoundary"],
} as const;
/** Compare supplied same-unit geological age coordinates without selecting a time-scale boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageBeforePresent, boundaryBeforePresent } = request;
  const compute = (): Output => {
    H.domain(ageBeforePresent >= 0 && boundaryBeforePresent >= 0);
    return {
      signedDistance: ageBeforePresent - boundaryBeforePresent,
      olderThanBoundary: ageBeforePresent > boundaryBeforePresent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageBeforePresent: 120, boundaryBeforePresent: 100 },
  output: { signedDistance: 20, olderThanBoundary: true },
} satisfies ToolExample<Input, Output>;
export const geologicalAgeBoundaryDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/geological-age-boundary-distance",
    title: "Geological Age Boundary Distance Tool",
    description:
      "Compare supplied same-unit geological age coordinates without selecting a time-scale boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageBeforePresent: { type: "number", minimum: 0 },
        boundaryBeforePresent: { type: "number", minimum: 0 },
      },
      required: ["ageBeforePresent", "boundaryBeforePresent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDistance: { type: "number" },
        olderThanBoundary: { type: "boolean" },
      },
      required: ["signedDistance", "olderThanBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "ageBeforePresent",
          label: "Age Before Present",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundaryBeforePresent",
          label: "Boundary Before Present",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDistance",
          label: "Signed Distance",
          valueType: { type: "number" },
        },
        {
          id: "olderThanBoundary",
          label: "Older Than Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = geologicalAgeBoundaryDistanceTool.execute;
export default geologicalAgeBoundaryDistanceTool;
