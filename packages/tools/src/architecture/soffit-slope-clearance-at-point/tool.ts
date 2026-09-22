import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startHeight: number;
  readonly gradient: number;
  readonly distance: number;
  readonly floorHeight: number;
};
export type Output = {
  readonly soffitHeight: number;
  readonly clearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startHeight: { type: "number" },
    gradient: { type: "number" },
    distance: { type: "number" },
    floorHeight: { type: "number" },
  },
  required: ["startHeight", "gradient", "distance", "floorHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    soffitHeight: { type: "number" },
    clearance: { type: "number" },
  },
  required: ["soffitHeight", "clearance"],
} as const;
/** Signed clearance under an explicitly supplied linear soffit profile. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startHeight, gradient, distance, floorHeight } = request;
  const compute = (): Output => {
    return {
      soffitHeight: startHeight + gradient * distance,
      clearance: startHeight + gradient * distance - floorHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startHeight: 3, gradient: -0.1, distance: 4, floorHeight: 0.2 },
  output: { soffitHeight: 2.6, clearance: 2.4 },
} satisfies ToolExample<Input, Output>;
export const soffitSlopeClearanceAtPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/soffit-slope-clearance-at-point",
    title: "Soffit Slope Clearance At Point Tool",
    description:
      "Signed clearance under an explicitly supplied linear soffit profile.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startHeight: { type: "number" },
        gradient: { type: "number" },
        distance: { type: "number" },
        floorHeight: { type: "number" },
      },
      required: ["startHeight", "gradient", "distance", "floorHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        soffitHeight: { type: "number" },
        clearance: { type: "number" },
      },
      required: ["soffitHeight", "clearance"],
    },
    ports: {
      inputs: [
        {
          id: "startHeight",
          label: "Start Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gradient",
          label: "Gradient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "floorHeight",
          label: "Floor Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "soffitHeight",
          label: "Soffit Height",
          valueType: { type: "number" },
        },
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soffitSlopeClearanceAtPointTool.execute;
export default soffitSlopeClearanceAtPointTool;
