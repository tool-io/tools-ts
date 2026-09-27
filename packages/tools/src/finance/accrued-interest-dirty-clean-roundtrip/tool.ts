import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly clean: number; readonly accrued: number };
export type Output = {
  readonly dirty: number;
  readonly recoveredClean: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clean: { type: "number" }, accrued: { type: "number" } },
  required: ["clean", "accrued"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dirty: { type: "number" }, recoveredClean: { type: "number" } },
  required: ["dirty", "recoveredClean"],
} as const;
/** Calculate accrued interest dirty clean roundtrip from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clean, accrued } = request;
  const compute = (): Output => {
    const dirty = clean + accrued;
    return { dirty, recoveredClean: dirty - accrued };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clean: 98.5, accrued: 1.25 },
  output: { dirty: 99.75, recoveredClean: 98.5 },
} satisfies ToolExample<Input, Output>;
export const accruedInterestDirtyCleanRoundtripTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/accrued-interest-dirty-clean-roundtrip",
    title: "Accrued Interest Dirty Clean Roundtrip Tool",
    description:
      "Calculate accrued interest dirty clean roundtrip from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { clean: { type: "number" }, accrued: { type: "number" } },
      required: ["clean", "accrued"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dirty: { type: "number" },
        recoveredClean: { type: "number" },
      },
      required: ["dirty", "recoveredClean"],
    },
    ports: {
      inputs: [
        {
          id: "clean",
          label: "Clean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "accrued",
          label: "Accrued",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dirty", label: "Dirty", valueType: { type: "number" } },
        {
          id: "recoveredClean",
          label: "Recovered Clean",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = accruedInterestDirtyCleanRoundtripTool.execute;
export default accruedInterestDirtyCleanRoundtripTool;
