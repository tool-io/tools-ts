import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedMass: number;
  readonly density: number;
  readonly elapsedHours: number;
  readonly interruptions: number;
};
export type Output = {
  readonly volume: number;
  readonly activeVolumePerHour: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedMass: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
    elapsedHours: { type: "number" },
    interruptions: { type: "number", minimum: 0 },
  },
  required: ["collectedMass", "density", "elapsedHours", "interruptions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number" },
    activeVolumePerHour: { type: "number" },
  },
  required: ["volume", "activeVolumePerHour"],
} as const;
/** Calculate grow room dehumidifier condensate flow term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedMass, density, elapsedHours, interruptions } = request;
  const compute = (): Output => {
    H.domain(
      collectedMass >= 0 && interruptions >= 0 && elapsedHours > interruptions,
    );
    H.positive(density);
    return {
      volume: collectedMass / density,
      activeVolumePerHour:
        collectedMass / (density * (elapsedHours - interruptions)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectedMass: 12, density: 1, elapsedHours: 8, interruptions: 2 },
  output: { volume: 12, activeVolumePerHour: 2 },
} satisfies ToolExample<Input, Output>;
export const growRoomDehumidifierCondensateFlowTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vertical-farming/grow-room-dehumidifier-condensate-flow-term",
      title: "Grow Room Dehumidifier Condensate Flow Term Tool",
      description:
        "Calculate grow room dehumidifier condensate flow term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          collectedMass: { type: "number", minimum: 0 },
          density: { type: "number", exclusiveMinimum: 0 },
          elapsedHours: { type: "number" },
          interruptions: { type: "number", minimum: 0 },
        },
        required: ["collectedMass", "density", "elapsedHours", "interruptions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          volume: { type: "number" },
          activeVolumePerHour: { type: "number" },
        },
        required: ["volume", "activeVolumePerHour"],
      },
      ports: {
        inputs: [
          {
            id: "collectedMass",
            label: "Collected Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "density",
            label: "Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsedHours",
            label: "Elapsed Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interruptions",
            label: "Interruptions",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "volume", label: "Volume", valueType: { type: "number" } },
          {
            id: "activeVolumePerHour",
            label: "Active Volume Per Hour",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = growRoomDehumidifierCondensateFlowTermTool.execute;
export default growRoomDehumidifierCondensateFlowTermTool;
