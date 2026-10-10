import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly magnitudeDegrees: number;
  readonly eastPositive: boolean;
  readonly eastward: boolean;
};
export type Output = { readonly signedDegrees: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnitudeDegrees: { type: "number", minimum: 0 },
    eastPositive: { type: "boolean" },
    eastward: { type: "boolean" },
  },
  required: ["magnitudeDegrees", "eastPositive", "eastward"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDegrees: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["signedDegrees", "label"],
} as const;
/** Express an explicitly supplied compass-deviation magnitude and direction under a caller-selected east-positive sign convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { magnitudeDegrees, eastPositive, eastward } = request;
  const compute = (): Output => {
    H.domain(magnitudeDegrees >= 0, "magnitudeDegrees");
    return {
      signedDegrees: magnitudeDegrees * (eastward === eastPositive ? 1 : -1),
      label: magnitudeDegrees + (eastward ? " E" : " W"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { magnitudeDegrees: 3, eastPositive: true, eastward: true },
  output: { signedDegrees: 3, label: "3 E" },
} satisfies ToolExample<Input, Output>;
export const compassDeviationEastWestTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["nautical", "engineering"],
      keywords: ["nautical", "engineering"],
    },
    id: "nautical/compass-deviation-east-west-token",
    title: "Compass Deviation East West Token",
    description:
      "Express an explicitly supplied compass-deviation magnitude and direction under a caller-selected east-positive sign convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        magnitudeDegrees: { type: "number", minimum: 0 },
        eastPositive: { type: "boolean" },
        eastward: { type: "boolean" },
      },
      required: ["magnitudeDegrees", "eastPositive", "eastward"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDegrees: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["signedDegrees", "label"],
    },
    ports: {
      inputs: [
        {
          id: "magnitudeDegrees",
          label: "Magnitude Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eastPositive",
          label: "East Positive",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "eastward",
          label: "Eastward",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedDegrees",
          label: "Signed Degrees",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = compassDeviationEastWestTokenTool.execute;
export default compassDeviationEastWestTokenTool;
