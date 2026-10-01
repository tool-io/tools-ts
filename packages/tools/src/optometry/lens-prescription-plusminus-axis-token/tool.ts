import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly sphere: number;
  readonly cylinder: number;
  readonly axisDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sphere: { type: "number" },
    cylinder: { type: "number" },
    axisDegrees: { type: "integer" },
  },
  required: ["sphere", "cylinder", "axisDegrees"],
} as const;
/** Parse an explicit signed sphere/cylinder and integer axis token without selecting a prescription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match =
      /^([+-]\d+(?:\.\d+)?)\/([+-]\d+(?:\.\d+)?)x(\d{1,3})(?![\s\S])/.exec(
        token,
      );
    H.domain(match, "token");
    const sphere = Number(match[1]),
      cylinder = Number(match[2]),
      axisDegrees = Number(match[3]);
    H.integer(axisDegrees, 0, 180);
    H.finite(sphere);
    H.finite(cylinder);
    return { sphere, cylinder, axisDegrees };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "-2.00/-1.25x090" },
  output: { sphere: -2, cylinder: -1.25, axisDegrees: 90 },
} satisfies ToolExample<Input, Output>;
export const lensPrescriptionPlusminusAxisTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/lens-prescription-plusminus-axis-token",
    title: "Lens Prescription Plusminus Axis Token Tool",
    description:
      "Parse an explicit signed sphere/cylinder and integer axis token without selecting a prescription.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sphere: { type: "number" },
        cylinder: { type: "number" },
        axisDegrees: { type: "integer" },
      },
      required: ["sphere", "cylinder", "axisDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "sphere", label: "Sphere", valueType: { type: "number" } },
        { id: "cylinder", label: "Cylinder", valueType: { type: "number" } },
        {
          id: "axisDegrees",
          label: "Axis Degrees",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = lensPrescriptionPlusminusAxisTokenTool.execute;
export default lensPrescriptionPlusminusAxisTokenTool;
