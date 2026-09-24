import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly secondX: number;
  readonly secondY: number;
  readonly firstRadius: number;
  readonly secondRadius: number;
};
export type Output = {
  readonly centerDistance: number;
  readonly boundaryGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstX: { type: "number" },
    firstY: { type: "number" },
    secondX: { type: "number" },
    secondY: { type: "number" },
    firstRadius: { type: "number", minimum: 0 },
    secondRadius: { type: "number", minimum: 0 },
  },
  required: [
    "firstX",
    "firstY",
    "secondX",
    "secondY",
    "firstRadius",
    "secondRadius",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerDistance: { type: "number" },
    boundaryGap: { type: "number" },
  },
  required: ["centerDistance", "boundaryGap"],
} as const;
/** Ideal circular patch separation from supplied centers/radii, without inferring functional connectivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, secondX, secondY, firstRadius, secondRadius } =
    request;
  const compute = (): Output => {
    H.domain(firstRadius >= 0 && secondRadius >= 0);
    return {
      centerDistance: Math.hypot(secondX - firstX, secondY - firstY),
      boundaryGap: Math.max(
        0,
        Math.hypot(secondX - firstX, secondY - firstY) -
          firstRadius -
          secondRadius,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstX: 0,
    firstY: 0,
    secondX: 6,
    secondY: 8,
    firstRadius: 2,
    secondRadius: 3,
  },
  output: { centerDistance: 10, boundaryGap: 5 },
} satisfies ToolExample<Input, Output>;
export const habitatPatchIsolationDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/habitat-patch-isolation-distance",
    title: "Habitat Patch Isolation Distance Tool",
    description:
      "Ideal circular patch separation from supplied centers/radii, without inferring functional connectivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstX: { type: "number" },
        firstY: { type: "number" },
        secondX: { type: "number" },
        secondY: { type: "number" },
        firstRadius: { type: "number", minimum: 0 },
        secondRadius: { type: "number", minimum: 0 },
      },
      required: [
        "firstX",
        "firstY",
        "secondX",
        "secondY",
        "firstRadius",
        "secondRadius",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerDistance: { type: "number" },
        boundaryGap: { type: "number" },
      },
      required: ["centerDistance", "boundaryGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstX",
          label: "First X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstY",
          label: "First Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondX",
          label: "Second X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondY",
          label: "Second Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstRadius",
          label: "First Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRadius",
          label: "Second Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "centerDistance",
          label: "Center Distance",
          valueType: { type: "number" },
        },
        {
          id: "boundaryGap",
          label: "Boundary Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = habitatPatchIsolationDistanceTool.execute;
export default habitatPatchIsolationDistanceTool;
