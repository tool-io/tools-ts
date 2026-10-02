import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressure: number;
  readonly cellArea: number;
  readonly suppliedPressureUnitFactor: number;
  readonly suppliedAreaUnitFactor: number;
};
export type Output = { readonly force: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressure: { type: "number" },
    cellArea: { type: "number", minimum: 0 },
    suppliedPressureUnitFactor: { type: "number", exclusiveMinimum: 0 },
    suppliedAreaUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "pressure",
    "cellArea",
    "suppliedPressureUnitFactor",
    "suppliedAreaUnitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { force: { type: "number" } },
  required: ["force"],
} as const;
/** Convert one supplied sensor-cell pressure and area to force using explicit compatible SI unit factors; no gait interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    pressure,
    cellArea,
    suppliedPressureUnitFactor,
    suppliedAreaUnitFactor,
  } = request;
  const compute = (): Output => {
    H.domain(cellArea >= 0);
    H.positive(suppliedPressureUnitFactor);
    H.positive(suppliedAreaUnitFactor);
    return {
      force:
        pressure *
        suppliedPressureUnitFactor *
        cellArea *
        suppliedAreaUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pressure: 10,
    cellArea: 2,
    suppliedPressureUnitFactor: 1000,
    suppliedAreaUnitFactor: 0.0001,
  },
  output: { force: 2 },
} satisfies ToolExample<Input, Output>;
export const plantarPressureCellForceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/plantar-pressure-cell-force",
    title: "Plantar Pressure Cell Force Tool",
    description:
      "Convert one supplied sensor-cell pressure and area to force using explicit compatible SI unit factors; no gait interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressure: { type: "number" },
        cellArea: { type: "number", minimum: 0 },
        suppliedPressureUnitFactor: { type: "number", exclusiveMinimum: 0 },
        suppliedAreaUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "pressure",
        "cellArea",
        "suppliedPressureUnitFactor",
        "suppliedAreaUnitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { force: { type: "number" } },
      required: ["force"],
    },
    ports: {
      inputs: [
        {
          id: "pressure",
          label: "Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellArea",
          label: "Cell Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPressureUnitFactor",
          label: "Supplied Pressure Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAreaUnitFactor",
          label: "Supplied Area Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "force", label: "Force", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = plantarPressureCellForceTool.execute;
export default plantarPressureCellForceTool;
