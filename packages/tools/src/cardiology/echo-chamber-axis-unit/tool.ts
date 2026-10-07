import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurementId: string;
  readonly value: number;
  readonly unitText: string;
  readonly axisWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurementId: { type: "string", maxLength: 8192, minLength: 1 },
    value: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
    axisWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["measurementId", "value", "unitText", "axisWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit echocardiographic dimension and axis without selecting a measurement convention or clinical range. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurementId, value, unitText, axisWording } = request;
  const compute = (): Output => {
    H.domain(
      measurementId.length > 0 && unitText.length > 0 && axisWording.length > 0,
      "measurementId",
    );
    H.domain(value >= 0, "value");
    return {
      label: measurementId + "; " + axisWording + "=" + value + " " + unitText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measurementId: "E17",
    value: 45,
    unitText: "mm",
    axisWording: "axis A",
  },
  output: { label: "E17; axis A=45 mm" },
} satisfies ToolExample<Input, Output>;
export const echoChamberAxisUnitTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["cardiology", "health and medicine"],
        keywords: ["cardiology", "health and medicine"],
      },
      id: "cardiology/echo-chamber-axis-unit",
      title: "Echo Chamber Axis Unit",
      description:
        "Label an explicit echocardiographic dimension and axis without selecting a measurement convention or clinical range.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measurementId: { type: "string", maxLength: 8192, minLength: 1 },
          value: { type: "number", minimum: 0 },
          unitText: { type: "string", maxLength: 8192, minLength: 1 },
          axisWording: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["measurementId", "value", "unitText", "axisWording"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "measurementId",
            label: "Measurement Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unitText",
            label: "Unit Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "axisWording",
            label: "Axis Wording",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = echoChamberAxisUnitTool.execute;
export default echoChamberAxisUnitTool;
