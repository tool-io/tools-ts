import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellAreas: readonly number[];
  readonly contact: readonly boolean[];
  readonly sensorValid: readonly boolean[];
  readonly calibrated: readonly boolean[];
};
export type Output = {
  readonly contactArea: number;
  readonly supportedArea: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellAreas: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    contact: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sensorValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    calibrated: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["cellAreas", "contact", "sensorValid", "calibrated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactArea: { type: "number" },
    supportedArea: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["contactArea", "supportedArea", "share", "defined"],
} as const;
/** Calculate plantar grid support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellAreas, contact, sensorValid, calibrated } = request;
  const compute = (): Output => {
    H.sameLength(cellAreas, contact);
    H.sameLength(cellAreas, sensorValid);
    H.sameLength(cellAreas, calibrated);
    H.domain(cellAreas.every((x) => x >= 0));
    return (() => {
      const contactArea = cellAreas.reduce(
          (s, x, i) => s + (contact[i] ? x : 0),
          0,
        ),
        supportedArea = cellAreas.reduce(
          (s, x, i) =>
            s + (contact[i] && sensorValid[i] && calibrated[i] ? x : 0),
          0,
        );
      return {
        contactArea,
        supportedArea,
        share: contactArea > 0 ? supportedArea / contactArea : 0,
        defined: contactArea > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cellAreas: [2, 3, 5],
    contact: [true, true, false],
    sensorValid: [true, true, true],
    calibrated: [true, false, true],
  },
  output: { contactArea: 5, supportedArea: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const plantarGridSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/plantar-grid-support-share",
    title: "Plantar Grid Support Share Tool",
    description:
      "Calculate plantar grid support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        contact: { type: "array", maxItems: 256, items: { type: "boolean" } },
        sensorValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        calibrated: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["cellAreas", "contact", "sensorValid", "calibrated"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactArea: { type: "number" },
        supportedArea: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["contactArea", "supportedArea", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "cellAreas",
          label: "Cell Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "contact",
          label: "Contact",
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
          id: "calibrated",
          label: "Calibrated",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "contactArea",
          label: "Contact Area",
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
export const run = plantarGridSupportShareTool.execute;
export default plantarGridSupportShareTool;
