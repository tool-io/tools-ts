import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly holeDiameter: number;
  readonly shaftDiameter: number;
};
export type Output = { readonly clearance: number; readonly fit: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    holeDiameter: { type: "number", minimum: 0 },
    shaftDiameter: { type: "number", minimum: 0 },
  },
  required: ["holeDiameter", "shaftDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearance: { type: "number" },
    fit: { type: "string", maxLength: 8192 },
  },
  required: ["clearance", "fit"],
} as const;
/** Calculate shaft hole clearance sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { holeDiameter, shaftDiameter } = request;
  const compute = (): Output => {
    H.domain(holeDiameter >= 0 && shaftDiameter >= 0);
    return {
      clearance: holeDiameter - shaftDiameter,
      fit:
        holeDiameter > shaftDiameter
          ? "clearance"
          : holeDiameter < shaftDiameter
            ? "interference"
            : "line-to-line",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { holeDiameter: 10.2, shaftDiameter: 10 },
  output: { clearance: 0.1999999999999993, fit: "clearance" },
} satisfies ToolExample<Input, Output>;
export const shaftHoleClearanceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/shaft-hole-clearance-sign",
    title: "Shaft Hole Clearance Sign Tool",
    description:
      "Calculate shaft hole clearance sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        holeDiameter: { type: "number", minimum: 0 },
        shaftDiameter: { type: "number", minimum: 0 },
      },
      required: ["holeDiameter", "shaftDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clearance: { type: "number" },
        fit: { type: "string", maxLength: 8192 },
      },
      required: ["clearance", "fit"],
    },
    ports: {
      inputs: [
        {
          id: "holeDiameter",
          label: "Hole Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shaftDiameter",
          label: "Shaft Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
        { id: "fit", label: "Fit", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = shaftHoleClearanceSignTool.execute;
export default shaftHoleClearanceSignTool;
