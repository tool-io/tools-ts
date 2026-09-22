import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly grossMass: number; readonly blankMass: number };
export type Output = {
  readonly netMass: number;
  readonly blankShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { grossMass: { type: "number" }, blankMass: { type: "number" } },
  required: ["grossMass", "blankMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    blankShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["netMass", "blankShare", "defined"],
} as const;
/** Preserve signed blank-corrected filter masses; zero gross mass has explicitly undefined share. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, blankMass } = request;
  const compute = (): Output => {
    return {
      netMass: grossMass - blankMass,
      blankShare: grossMass !== 0 ? blankMass / grossMass : 0,
      defined: grossMass !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossMass: 10, blankMass: 2 },
  output: { netMass: 8, blankShare: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const filterBlankMassShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/filter-blank-mass-share",
    title: "Filter Blank Mass Share Tool",
    description:
      "Preserve signed blank-corrected filter masses; zero gross mass has explicitly undefined share.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number" },
        blankMass: { type: "number" },
      },
      required: ["grossMass", "blankMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        blankShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["netMass", "blankShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankMass",
          label: "Blank Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        {
          id: "blankShare",
          label: "Blank Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = filterBlankMassShareTool.execute;
export default filterBlankMassShareTool;
