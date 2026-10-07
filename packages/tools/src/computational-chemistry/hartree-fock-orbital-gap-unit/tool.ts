import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occupiedEnergyHartree: number;
  readonly virtualEnergyHartree: number;
  readonly suppliedEvPerHartree: number;
};
export type Output = { readonly gapHartree: number; readonly gapEv: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedEnergyHartree: { type: "number" },
    virtualEnergyHartree: { type: "number" },
    suppliedEvPerHartree: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "occupiedEnergyHartree",
    "virtualEnergyHartree",
    "suppliedEvPerHartree",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gapHartree: { type: "number" }, gapEv: { type: "number" } },
  required: ["gapHartree", "gapEv"],
} as const;
/** Calculate a supplied virtual-minus-occupied orbital-energy gap in hartree and electronvolts using an explicit conversion constant. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupiedEnergyHartree, virtualEnergyHartree, suppliedEvPerHartree } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedEvPerHartree) && suppliedEvPerHartree > 0,
      "suppliedEvPerHartree",
    ),
      suppliedEvPerHartree);
    return {
      gapHartree: virtualEnergyHartree - occupiedEnergyHartree,
      gapEv:
        (virtualEnergyHartree - occupiedEnergyHartree) * suppliedEvPerHartree,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    occupiedEnergyHartree: -0.5,
    virtualEnergyHartree: -0.25,
    suppliedEvPerHartree: 27.2,
  },
  output: { gapHartree: 0.25, gapEv: 6.8 },
} satisfies ToolExample<Input, Output>;
export const hartreeFockOrbitalGapUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/hartree-fock-orbital-gap-unit",
    title: "Hartree Fock Orbital Gap Unit",
    description:
      "Calculate a supplied virtual-minus-occupied orbital-energy gap in hartree and electronvolts using an explicit conversion constant.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedEnergyHartree: { type: "number" },
        virtualEnergyHartree: { type: "number" },
        suppliedEvPerHartree: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "occupiedEnergyHartree",
        "virtualEnergyHartree",
        "suppliedEvPerHartree",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gapHartree: { type: "number" }, gapEv: { type: "number" } },
      required: ["gapHartree", "gapEv"],
    },
    ports: {
      inputs: [
        {
          id: "occupiedEnergyHartree",
          label: "Occupied Energy Hartree",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "virtualEnergyHartree",
          label: "Virtual Energy Hartree",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedEvPerHartree",
          label: "Supplied Ev Per Hartree",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gapHartree",
          label: "Gap Hartree",
          valueType: { type: "number" },
        },
        { id: "gapEv", label: "Gap Ev", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hartreeFockOrbitalGapUnitTool.execute;
export default hartreeFockOrbitalGapUnitTool;
