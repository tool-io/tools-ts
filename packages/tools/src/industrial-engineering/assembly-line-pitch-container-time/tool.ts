import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unitsPerContainer: number;
  readonly cycleTimePerUnit: number;
};
export type Output = { readonly containerPitchTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitsPerContainer: { type: "integer", minimum: 1 },
    cycleTimePerUnit: { type: "number", minimum: 0 },
  },
  required: ["unitsPerContainer", "cycleTimePerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { containerPitchTime: { type: "number" } },
  required: ["containerPitchTime"],
} as const;
/** Multiply explicit units per transfer container by supplied per-unit cycle time without balancing an assembly line. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unitsPerContainer, cycleTimePerUnit } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(unitsPerContainer) &&
        unitsPerContainer >= 1 &&
        unitsPerContainer <= Number.MAX_SAFE_INTEGER,
      "unitsPerContainer",
    ),
      unitsPerContainer);
    H.domain(cycleTimePerUnit >= 0, "cycleTimePerUnit");
    return { containerPitchTime: unitsPerContainer * cycleTimePerUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unitsPerContainer: 20, cycleTimePerUnit: 0.5 },
  output: { containerPitchTime: 10 },
} satisfies ToolExample<Input, Output>;
export const assemblyLinePitchContainerTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/assembly-line-pitch-container-time",
    title: "Assembly Line Pitch Container Time Tool",
    description:
      "Multiply explicit units per transfer container by supplied per-unit cycle time without balancing an assembly line.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitsPerContainer: { type: "integer", minimum: 1 },
        cycleTimePerUnit: { type: "number", minimum: 0 },
      },
      required: ["unitsPerContainer", "cycleTimePerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { containerPitchTime: { type: "number" } },
      required: ["containerPitchTime"],
    },
    ports: {
      inputs: [
        {
          id: "unitsPerContainer",
          label: "Units Per Container",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cycleTimePerUnit",
          label: "Cycle Time Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "containerPitchTime",
          label: "Container Pitch Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assemblyLinePitchContainerTimeTool.execute;
export default assemblyLinePitchContainerTimeTool;
