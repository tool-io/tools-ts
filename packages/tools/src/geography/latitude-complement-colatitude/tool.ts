import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly latitudeDegrees: number };
export type Output = { readonly colatitudeDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitudeDegrees: { type: "number", minimum: -90, maximum: 90 },
  },
  required: ["latitudeDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { colatitudeDegrees: { type: "number" } },
  required: ["colatitudeDegrees"],
} as const;
/** Calculate latitude complement colatitude from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latitudeDegrees } = request;
  const compute = (): Output => {
    H.domain(latitudeDegrees >= -90 && latitudeDegrees <= 90);
    return { colatitudeDegrees: 90 - latitudeDegrees };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latitudeDegrees: 30 },
  output: { colatitudeDegrees: 60 },
} satisfies ToolExample<Input, Output>;
export const latitudeComplementColatitudeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/latitude-complement-colatitude",
    title: "Latitude Complement Colatitude Tool",
    description:
      "Calculate latitude complement colatitude from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latitudeDegrees: { type: "number", minimum: -90, maximum: 90 },
      },
      required: ["latitudeDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { colatitudeDegrees: { type: "number" } },
      required: ["colatitudeDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "latitudeDegrees",
          label: "Latitude Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "colatitudeDegrees",
          label: "Colatitude Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = latitudeComplementColatitudeTool.execute;
export default latitudeComplementColatitudeTool;
