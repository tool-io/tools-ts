import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
  readonly elapsed: number;
};
export type Output = {
  readonly dx: number;
  readonly dy: number;
  readonly speed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startX: { type: "number" },
    startY: { type: "number" },
    endX: { type: "number" },
    endY: { type: "number" },
    elapsed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["startX", "startY", "endX", "endY", "elapsed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dx: { type: "number" },
    dy: { type: "number" },
    speed: { type: "number" },
  },
  required: ["dx", "dy", "speed"],
} as const;
/** One observed planar marker displacement at a supplied time interval; no developmental mechanism is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startX, startY, endX, endY, elapsed } = request;
  const compute = (): Output => {
    H.positive(elapsed);
    return {
      dx: endX - startX,
      dy: endY - startY,
      speed: Math.hypot(endX - startX, endY - startY) / elapsed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startX: 1, startY: 2, endX: 4, endY: 6, elapsed: 2 },
  output: { dx: 3, dy: 4, speed: 2.5 },
} satisfies ToolExample<Input, Output>;
export const gastrulationMarkerMigrationOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/gastrulation-marker-migration-one-step",
    title: "Gastrulation Marker Migration One Step Tool",
    description:
      "One observed planar marker displacement at a supplied time interval; no developmental mechanism is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startX: { type: "number" },
        startY: { type: "number" },
        endX: { type: "number" },
        endY: { type: "number" },
        elapsed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["startX", "startY", "endX", "endY", "elapsed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dx: { type: "number" },
        dy: { type: "number" },
        speed: { type: "number" },
      },
      required: ["dx", "dy", "speed"],
    },
    ports: {
      inputs: [
        {
          id: "startX",
          label: "Start X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startY",
          label: "Start Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endX",
          label: "End X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endY",
          label: "End Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dx", label: "Dx", valueType: { type: "number" } },
        { id: "dy", label: "Dy", valueType: { type: "number" } },
        { id: "speed", label: "Speed", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gastrulationMarkerMigrationOneStepTool.execute;
export default gastrulationMarkerMigrationOneStepTool;
