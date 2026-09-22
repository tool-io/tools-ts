import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moleculesPerArea: number;
  readonly area: number;
  readonly avogadro: number;
};
export type Output = {
  readonly totalMolecules: number;
  readonly moles: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moleculesPerArea: { type: "number", minimum: 0 },
    area: { type: "number", minimum: 0 },
    avogadro: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["moleculesPerArea", "area", "avogadro"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalMolecules: { type: "number" }, moles: { type: "number" } },
  required: ["totalMolecules", "moles"],
} as const;
/** Convert a molecular column to total molecules and moles with an explicit Avogadro conversion value and consistent area units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moleculesPerArea, area, avogadro } = request;
  const compute = (): Output => {
    H.domain(moleculesPerArea >= 0 && area >= 0);
    H.positive(avogadro);
    return {
      totalMolecules: moleculesPerArea * area,
      moles: (moleculesPerArea * area) / avogadro,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    moleculesPerArea: 100000000000000000000,
    area: 1,
    avogadro: 6.02214076e23,
  },
  output: {
    totalMolecules: 100000000000000000000,
    moles: 0.00016605390671738468,
  },
} satisfies ToolExample<Input, Output>;
export const traceGasColumnMoleculeMoleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/trace-gas-column-molecule-mole-factor",
    title: "Trace Gas Column Molecule Mole Factor Tool",
    description:
      "Convert a molecular column to total molecules and moles with an explicit Avogadro conversion value and consistent area units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moleculesPerArea: { type: "number", minimum: 0 },
        area: { type: "number", minimum: 0 },
        avogadro: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["moleculesPerArea", "area", "avogadro"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMolecules: { type: "number" },
        moles: { type: "number" },
      },
      required: ["totalMolecules", "moles"],
    },
    ports: {
      inputs: [
        {
          id: "moleculesPerArea",
          label: "Molecules Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "avogadro",
          label: "Avogadro",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalMolecules",
          label: "Total Molecules",
          valueType: { type: "number" },
        },
        { id: "moles", label: "Moles", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = traceGasColumnMoleculeMoleFactorTool.execute;
export default traceGasColumnMoleculeMoleFactorTool;
