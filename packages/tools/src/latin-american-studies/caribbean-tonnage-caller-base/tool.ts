import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTonnage: number;
  readonly suppliedBaseUnitsPerTon: number;
  readonly source: string;
};
export type Output = { readonly baseMass: number; readonly source: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTonnage: { type: "number", minimum: 0 },
    suppliedBaseUnitsPerTon: { type: "number", exclusiveMinimum: 0 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["recordedTonnage", "suppliedBaseUnitsPerTon", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseMass: { type: "number" },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["baseMass", "source"],
} as const;
/** Calculate caribbean tonnage caller base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTonnage, suppliedBaseUnitsPerTon, source } = request;
  const compute = (): Output => {
    H.domain(recordedTonnage >= 0 && source.length > 0);
    H.positive(suppliedBaseUnitsPerTon);
    return { baseMass: recordedTonnage * suppliedBaseUnitsPerTon, source };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedTonnage: 3,
    suppliedBaseUnitsPerTon: 900,
    source: "ledger-A",
  },
  output: { baseMass: 2700, source: "ledger-A" },
} satisfies ToolExample<Input, Output>;
export const caribbeanTonnageCallerBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "latin-american-studies/caribbean-tonnage-caller-base",
    title: "Caribbean Tonnage Caller Base Tool",
    description:
      "Calculate caribbean tonnage caller base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedTonnage: { type: "number", minimum: 0 },
        suppliedBaseUnitsPerTon: { type: "number", exclusiveMinimum: 0 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["recordedTonnage", "suppliedBaseUnitsPerTon", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseMass: { type: "number" },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["baseMass", "source"],
    },
    ports: {
      inputs: [
        {
          id: "recordedTonnage",
          label: "Recorded Tonnage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBaseUnitsPerTon",
          label: "Supplied Base Units Per Ton",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "baseMass", label: "Base Mass", valueType: { type: "number" } },
        { id: "source", label: "Source", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = caribbeanTonnageCallerBaseTool.execute;
export default caribbeanTonnageCallerBaseTool;
