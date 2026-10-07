import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly suppliedDiameter: number };
export type Output = { readonly circularArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { suppliedDiameter: { type: "number", minimum: 0 } },
  required: ["suppliedDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { circularArea: { type: "number" } },
  required: ["circularArea"],
} as const;
/** Compute a circular cross-sectional area from an explicitly supplied diameter without selecting a fabrication nozzle. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedDiameter } = request;
  const compute = (): Output => {
    H.domain(suppliedDiameter >= 0, "suppliedDiameter");
    return {
      circularArea: Math.PI * (suppliedDiameter / 2) * (suppliedDiameter / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedDiameter: 2 },
  output: { circularArea: 3.141592653589793 },
} satisfies ToolExample<Input, Output>;
export const nozzleSuppliedDiameterAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biofabrication", "engineering"],
      keywords: ["biofabrication", "engineering"],
    },
    id: "biofabrication/nozzle-supplied-diameter-area",
    title: "Nozzle Supplied Diameter Area",
    description:
      "Compute a circular cross-sectional area from an explicitly supplied diameter without selecting a fabrication nozzle.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { suppliedDiameter: { type: "number", minimum: 0 } },
      required: ["suppliedDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { circularArea: { type: "number" } },
      required: ["circularArea"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedDiameter",
          label: "Supplied Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "circularArea",
          label: "Circular Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nozzleSuppliedDiameterAreaTool.execute;
export default nozzleSuppliedDiameterAreaTool;
