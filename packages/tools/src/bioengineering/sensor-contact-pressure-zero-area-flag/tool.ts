import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly force: number; readonly contactArea: number };
export type Output = {
  readonly defined: boolean;
  readonly nominalPressure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number", minimum: 0 },
    contactArea: { type: "number", minimum: 0 },
  },
  required: ["force", "contactArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    nominalPressure: { type: "number" },
  },
  required: ["defined", "nominalPressure"],
} as const;
/** Nominal supplied bench force/area, with undefined zero area explicit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, contactArea } = request;
  const compute = (): Output => {
    H.domain(force >= 0 && contactArea >= 0);
    return {
      defined: contactArea > 0,
      nominalPressure: contactArea > 0 ? force / contactArea : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 10, contactArea: 0 },
  output: { defined: false, nominalPressure: 0 },
} satisfies ToolExample<Input, Output>;
export const sensorContactPressureZeroAreaFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/sensor-contact-pressure-zero-area-flag",
    title: "Sensor Contact Pressure Zero Area Flag Tool",
    description:
      "Nominal supplied bench force/area, with undefined zero area explicit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number", minimum: 0 },
        contactArea: { type: "number", minimum: 0 },
      },
      required: ["force", "contactArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        nominalPressure: { type: "number" },
      },
      required: ["defined", "nominalPressure"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactArea",
          label: "Contact Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "nominalPressure",
          label: "Nominal Pressure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sensorContactPressureZeroAreaFlagTool.execute;
export default sensorContactPressureZeroAreaFlagTool;
