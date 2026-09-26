import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly floorArea: number;
  readonly ceilingHeight: number;
  readonly displacedVolume: number;
  readonly airflowPerHour: number;
};
export type Output = {
  readonly netVolume: number;
  readonly airChangesPerHour: number;
  readonly nominalResidenceHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    floorArea: { type: "number", exclusiveMinimum: 0 },
    ceilingHeight: { type: "number", exclusiveMinimum: 0 },
    displacedVolume: { type: "number", minimum: 0 },
    airflowPerHour: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["floorArea", "ceilingHeight", "displacedVolume", "airflowPerHour"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netVolume: { type: "number" },
    airChangesPerHour: { type: "number" },
    nominalResidenceHours: { type: "number" },
  },
  required: ["netVolume", "airChangesPerHour", "nominalResidenceHours"],
} as const;
/** Calculate housing ventilation room volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { floorArea, ceilingHeight, displacedVolume, airflowPerHour } = request;
  const compute = (): Output => {
    H.domain(
      floorArea > 0 &&
        ceilingHeight > 0 &&
        displacedVolume >= 0 &&
        floorArea * ceilingHeight > displacedVolume,
    );
    H.positive(airflowPerHour);
    return {
      netVolume: floorArea * ceilingHeight - displacedVolume,
      airChangesPerHour:
        airflowPerHour / (floorArea * ceilingHeight - displacedVolume),
      nominalResidenceHours:
        (floorArea * ceilingHeight - displacedVolume) / airflowPerHour,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    floorArea: 20,
    ceilingHeight: 3,
    displacedVolume: 10,
    airflowPerHour: 100,
  },
  output: { netVolume: 50, airChangesPerHour: 2, nominalResidenceHours: 0.5 },
} satisfies ToolExample<Input, Output>;
export const housingVentilationRoomVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/housing-ventilation-room-volume-factor",
    title: "Housing Ventilation Room Volume Factor Tool",
    description:
      "Calculate housing ventilation room volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        floorArea: { type: "number", exclusiveMinimum: 0 },
        ceilingHeight: { type: "number", exclusiveMinimum: 0 },
        displacedVolume: { type: "number", minimum: 0 },
        airflowPerHour: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "floorArea",
        "ceilingHeight",
        "displacedVolume",
        "airflowPerHour",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netVolume: { type: "number" },
        airChangesPerHour: { type: "number" },
        nominalResidenceHours: { type: "number" },
      },
      required: ["netVolume", "airChangesPerHour", "nominalResidenceHours"],
    },
    ports: {
      inputs: [
        {
          id: "floorArea",
          label: "Floor Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ceilingHeight",
          label: "Ceiling Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacedVolume",
          label: "Displaced Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "airflowPerHour",
          label: "Airflow Per Hour",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netVolume", label: "Net Volume", valueType: { type: "number" } },
        {
          id: "airChangesPerHour",
          label: "Air Changes Per Hour",
          valueType: { type: "number" },
        },
        {
          id: "nominalResidenceHours",
          label: "Nominal Residence Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = housingVentilationRoomVolumeFactorTool.execute;
export default housingVentilationRoomVolumeFactorTool;
