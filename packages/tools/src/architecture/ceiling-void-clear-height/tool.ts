import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly floorToSoffitHeight: number;
  readonly occupiedClearHeight: number;
  readonly ceilingThickness: number;
};
export type Output = {
  readonly voidClearHeight: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    floorToSoffitHeight: { type: "number", minimum: 0 },
    occupiedClearHeight: { type: "number", minimum: 0 },
    ceilingThickness: { type: "number", minimum: 0 },
  },
  required: ["floorToSoffitHeight", "occupiedClearHeight", "ceilingThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidClearHeight: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["voidClearHeight", "fits"],
} as const;
/** Resolve the ceiling-service void from measured soffit height, desired occupied clear height and ceiling thickness. Negative clearance reports a geometric conflict. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { floorToSoffitHeight, occupiedClearHeight, ceilingThickness } =
    request;
  const compute = (): Output => {
    H.domain(
      floorToSoffitHeight >= 0 &&
        occupiedClearHeight >= 0 &&
        ceilingThickness >= 0,
      "floorToSoffitHeight",
    );
    return {
      voidClearHeight:
        floorToSoffitHeight - occupiedClearHeight - ceilingThickness,
      fits: floorToSoffitHeight >= occupiedClearHeight + ceilingThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    floorToSoffitHeight: 3.2,
    occupiedClearHeight: 2.7,
    ceilingThickness: 0.1,
  },
  output: { voidClearHeight: 0.4, fits: true },
} satisfies ToolExample<Input, Output>;
export const ceilingVoidClearHeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/ceiling-void-clear-height",
    title: "Ceiling Void Clear Height Tool",
    description:
      "Resolve the ceiling-service void from measured soffit height, desired occupied clear height and ceiling thickness. Negative clearance reports a geometric conflict.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        floorToSoffitHeight: { type: "number", minimum: 0 },
        occupiedClearHeight: { type: "number", minimum: 0 },
        ceilingThickness: { type: "number", minimum: 0 },
      },
      required: [
        "floorToSoffitHeight",
        "occupiedClearHeight",
        "ceilingThickness",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voidClearHeight: { type: "number" },
        fits: { type: "boolean" },
      },
      required: ["voidClearHeight", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "floorToSoffitHeight",
          label: "Floor To Soffit Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupiedClearHeight",
          label: "Occupied Clear Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ceilingThickness",
          label: "Ceiling Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voidClearHeight",
          label: "Void Clear Height",
          valueType: { type: "number" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ceilingVoidClearHeightTool.execute;
export default ceilingVoidClearHeightTool;
