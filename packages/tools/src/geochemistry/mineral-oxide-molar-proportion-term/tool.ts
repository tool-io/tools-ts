import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oxideMass: number;
  readonly oxideMolarMass: number;
  readonly cationsPerFormula: number;
  readonly oxygensPerFormula: number;
};
export type Output = {
  readonly oxideMoles: number;
  readonly cationMoles: number;
  readonly oxygenMoles: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oxideMass: { type: "number", minimum: 0 },
    oxideMolarMass: { type: "number", exclusiveMinimum: 0 },
    cationsPerFormula: { type: "integer", minimum: 1 },
    oxygensPerFormula: { type: "integer", minimum: 1 },
  },
  required: [
    "oxideMass",
    "oxideMolarMass",
    "cationsPerFormula",
    "oxygensPerFormula",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oxideMoles: { type: "number" },
    cationMoles: { type: "number" },
    oxygenMoles: { type: "number" },
  },
  required: ["oxideMoles", "cationMoles", "oxygenMoles"],
} as const;
/** Calculate mineral oxide molar proportion term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oxideMass, oxideMolarMass, cationsPerFormula, oxygensPerFormula } =
    request;
  const compute = (): Output => {
    H.domain(oxideMass >= 0);
    H.positive(oxideMolarMass);
    H.integer(cationsPerFormula, 1);
    H.integer(oxygensPerFormula, 1);
    return {
      oxideMoles: oxideMass / oxideMolarMass,
      cationMoles: (oxideMass * cationsPerFormula) / oxideMolarMass,
      oxygenMoles: (oxideMass * oxygensPerFormula) / oxideMolarMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oxideMass: 60,
    oxideMolarMass: 60,
    cationsPerFormula: 1,
    oxygensPerFormula: 2,
  },
  output: { oxideMoles: 1, cationMoles: 1, oxygenMoles: 2 },
} satisfies ToolExample<Input, Output>;
export const mineralOxideMolarProportionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/mineral-oxide-molar-proportion-term",
    title: "Mineral Oxide Molar Proportion Term Tool",
    description:
      "Calculate mineral oxide molar proportion term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oxideMass: { type: "number", minimum: 0 },
        oxideMolarMass: { type: "number", exclusiveMinimum: 0 },
        cationsPerFormula: { type: "integer", minimum: 1 },
        oxygensPerFormula: { type: "integer", minimum: 1 },
      },
      required: [
        "oxideMass",
        "oxideMolarMass",
        "cationsPerFormula",
        "oxygensPerFormula",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oxideMoles: { type: "number" },
        cationMoles: { type: "number" },
        oxygenMoles: { type: "number" },
      },
      required: ["oxideMoles", "cationMoles", "oxygenMoles"],
    },
    ports: {
      inputs: [
        {
          id: "oxideMass",
          label: "Oxide Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oxideMolarMass",
          label: "Oxide Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cationsPerFormula",
          label: "Cations Per Formula",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oxygensPerFormula",
          label: "Oxygens Per Formula",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "oxideMoles",
          label: "Oxide Moles",
          valueType: { type: "number" },
        },
        {
          id: "cationMoles",
          label: "Cation Moles",
          valueType: { type: "number" },
        },
        {
          id: "oxygenMoles",
          label: "Oxygen Moles",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mineralOxideMolarProportionTermTool.execute;
export default mineralOxideMolarProportionTermTool;
