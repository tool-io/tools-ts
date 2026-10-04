import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trayAreas: readonly number[];
  readonly occupied: readonly boolean[];
  readonly sensorValid: readonly boolean[];
  readonly recordCurrent: readonly boolean[];
};
export type Output = {
  readonly occupiedArea: number;
  readonly supportedArea: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trayAreas: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    occupied: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sensorValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    recordCurrent: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["trayAreas", "occupied", "sensorValid", "recordCurrent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedArea: { type: "number" },
    supportedArea: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["occupiedArea", "supportedArea", "share", "defined"],
} as const;
/** Calculate growing tray support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trayAreas, occupied, sensorValid, recordCurrent } = request;
  const compute = (): Output => {
    H.sameLength(trayAreas, occupied);
    H.sameLength(trayAreas, sensorValid);
    H.sameLength(trayAreas, recordCurrent);
    H.domain(trayAreas.every((x) => x >= 0));
    return (() => {
      const occupiedArea = trayAreas.reduce(
          (s, x, i) => s + (occupied[i] ? x : 0),
          0,
        ),
        supportedArea = trayAreas.reduce(
          (s, x, i) =>
            s + (occupied[i] && sensorValid[i] && recordCurrent[i] ? x : 0),
          0,
        );
      return {
        occupiedArea,
        supportedArea,
        share: occupiedArea > 0 ? supportedArea / occupiedArea : 0,
        defined: occupiedArea > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trayAreas: [2, 3, 5],
    occupied: [true, true, false],
    sensorValid: [true, true, true],
    recordCurrent: [true, false, true],
  },
  output: { occupiedArea: 5, supportedArea: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const growingTraySupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/growing-tray-support-share",
    title: "Growing Tray Support Share Tool",
    description:
      "Calculate growing tray support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trayAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        occupied: { type: "array", maxItems: 256, items: { type: "boolean" } },
        sensorValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        recordCurrent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["trayAreas", "occupied", "sensorValid", "recordCurrent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedArea: { type: "number" },
        supportedArea: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["occupiedArea", "supportedArea", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "trayAreas",
          label: "Tray Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "occupied",
          label: "Occupied",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sensorValid",
          label: "Sensor Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "recordCurrent",
          label: "Record Current",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "occupiedArea",
          label: "Occupied Area",
          valueType: { type: "number" },
        },
        {
          id: "supportedArea",
          label: "Supported Area",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = growingTraySupportShareTool.execute;
export default growingTraySupportShareTool;
