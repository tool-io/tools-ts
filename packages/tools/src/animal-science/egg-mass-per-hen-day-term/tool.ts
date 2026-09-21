import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eggs: number;
  readonly meanEggMass: number;
  readonly henDays: number;
};
export type Output = {
  readonly eggMass: number;
  readonly massPerHenDay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eggs: { type: "integer", minimum: 0 },
    meanEggMass: { type: "number", minimum: 0 },
    henDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["eggs", "meanEggMass", "henDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eggMass: { type: "number" },
    massPerHenDay: { type: "number" },
  },
  required: ["eggMass", "massPerHenDay"],
} as const;
/** Calculate egg mass per hen day term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eggs, meanEggMass, henDays } = request;
  const compute = (): Output => {
    H.integer(eggs, 0);
    H.domain(meanEggMass >= 0);
    H.positive(henDays);
    return {
      eggMass: eggs * meanEggMass,
      massPerHenDay: (eggs * meanEggMass) / henDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eggs: 80, meanEggMass: 60, henDays: 100 },
  output: { eggMass: 4800, massPerHenDay: 48 },
} satisfies ToolExample<Input, Output>;
export const eggMassPerHenDayTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/egg-mass-per-hen-day-term",
    title: "Egg Mass Per Hen Day Term Tool",
    description:
      "Calculate egg mass per hen day term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eggs: { type: "integer", minimum: 0 },
        meanEggMass: { type: "number", minimum: 0 },
        henDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["eggs", "meanEggMass", "henDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eggMass: { type: "number" },
        massPerHenDay: { type: "number" },
      },
      required: ["eggMass", "massPerHenDay"],
    },
    ports: {
      inputs: [
        {
          id: "eggs",
          label: "Eggs",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "meanEggMass",
          label: "Mean Egg Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "henDays",
          label: "Hen Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "eggMass", label: "Egg Mass", valueType: { type: "number" } },
        {
          id: "massPerHenDay",
          label: "Mass Per Hen Day",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eggMassPerHenDayTermTool.execute;
export default eggMassPerHenDayTermTool;
