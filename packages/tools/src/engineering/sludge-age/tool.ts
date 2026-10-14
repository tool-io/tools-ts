import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualBiologicalSolidsInventoryKg: number;
  readonly actualWasteSolidsKgPerDay: number;
  readonly actualEffluentSolidsKgPerDay: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualBiologicalSolidsInventoryKg",
    label: "Actual biological solids inventory kg",
    kind: "number",
  },
  {
    id: "actualWasteSolidsKgPerDay",
    label: "Actual waste solids kg per day",
    kind: "number",
  },
  {
    id: "actualEffluentSolidsKgPerDay",
    label: "Actual effluent solids kg per day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualBiologicalSolidsInventoryKg,
    "actualBiologicalSolidsInventoryKg",
  );
  nonnegative(input.actualWasteSolidsKgPerDay, "actualWasteSolidsKgPerDay");
  nonnegative(
    input.actualEffluentSolidsKgPerDay,
    "actualEffluentSolidsKgPerDay",
  );
  positive(
    input.actualWasteSolidsKgPerDay + input.actualEffluentSolidsKgPerDay,
    "removal",
  );
  return {
    value:
      input.actualBiologicalSolidsInventoryKg /
      (input.actualWasteSolidsKgPerDay + input.actualEffluentSolidsKgPerDay),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualBiologicalSolidsInventoryKg: 10,
    actualWasteSolidsKgPerDay: 3,
    actualEffluentSolidsKgPerDay: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/sludge-age",
  title: "Sludge Age Calculator",
  description:
    "Actual solids retention/sludge age mass inventory/(waste+effluent solids mass rate), not hydraulicHRT; complete matched biomass pool external. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
