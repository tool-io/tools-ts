import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rearEyeHeight: number;
  readonly frontEyeHeight: number;
  readonly rearDistance: number;
  readonly rowSpacing: number;
  readonly targetHeight: number;
  readonly requiredClearance: number;
};
export type Output = {
  readonly rayHeightAtFront: number;
  readonly clearance: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rearEyeHeight: { type: "number" },
    frontEyeHeight: { type: "number" },
    rearDistance: { type: "number", exclusiveMinimum: 0 },
    rowSpacing: { type: "number", minimum: 0 },
    targetHeight: { type: "number" },
    requiredClearance: { type: "number", minimum: 0 },
  },
  required: [
    "rearEyeHeight",
    "frontEyeHeight",
    "rearDistance",
    "rowSpacing",
    "targetHeight",
    "requiredClearance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rayHeightAtFront: { type: "number" },
    clearance: { type: "number" },
    margin: { type: "number" },
  },
  required: ["rayHeightAtFront", "clearance", "margin"],
} as const;
/** Linear sight ray from rear eye to target; frontEyeHeight must include the caller-selected obstruction reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rearEyeHeight,
    frontEyeHeight,
    rearDistance,
    rowSpacing,
    targetHeight,
    requiredClearance,
  } = request;
  const compute = (): Output => {
    H.positive(rearDistance);
    H.domain(
      rowSpacing >= 0 && rowSpacing <= rearDistance && requiredClearance >= 0,
    );
    return {
      rayHeightAtFront:
        targetHeight +
        ((rearEyeHeight - targetHeight) * (rearDistance - rowSpacing)) /
          rearDistance,
      clearance:
        targetHeight +
        ((rearEyeHeight - targetHeight) * (rearDistance - rowSpacing)) /
          rearDistance -
        frontEyeHeight,
      margin:
        targetHeight +
        ((rearEyeHeight - targetHeight) * (rearDistance - rowSpacing)) /
          rearDistance -
        frontEyeHeight -
        requiredClearance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rearEyeHeight: 2,
    frontEyeHeight: 1.5,
    rearDistance: 10,
    rowSpacing: 2,
    targetHeight: 0,
    requiredClearance: 0.1,
  },
  output: {
    rayHeightAtFront: 1.6,
    clearance: 0.10000000000000009,
    margin: 8.326672684688674e-17,
  },
} satisfies ToolExample<Input, Output>;
export const theatreSeatSightlineOffsetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/theatre-seat-sightline-offset-term",
    title: "Theatre Seat Sightline Offset Term Tool",
    description:
      "Linear sight ray from rear eye to target; frontEyeHeight must include the caller-selected obstruction reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rearEyeHeight: { type: "number" },
        frontEyeHeight: { type: "number" },
        rearDistance: { type: "number", exclusiveMinimum: 0 },
        rowSpacing: { type: "number", minimum: 0 },
        targetHeight: { type: "number" },
        requiredClearance: { type: "number", minimum: 0 },
      },
      required: [
        "rearEyeHeight",
        "frontEyeHeight",
        "rearDistance",
        "rowSpacing",
        "targetHeight",
        "requiredClearance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rayHeightAtFront: { type: "number" },
        clearance: { type: "number" },
        margin: { type: "number" },
      },
      required: ["rayHeightAtFront", "clearance", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "rearEyeHeight",
          label: "Rear Eye Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frontEyeHeight",
          label: "Front Eye Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rearDistance",
          label: "Rear Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rowSpacing",
          label: "Row Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetHeight",
          label: "Target Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredClearance",
          label: "Required Clearance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rayHeightAtFront",
          label: "Ray Height At Front",
          valueType: { type: "number" },
        },
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = theatreSeatSightlineOffsetTermTool.execute;
export default theatreSeatSightlineOffsetTermTool;
