import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly assessableResidualBasalAreaM2: number;
  readonly damagedResidualBasalAreaM2: number;
  readonly unassessableResidualBasalAreaM2: number;
}>;
export type Output = Readonly<{
  readonly observableResidualDamagePercent: number;
  readonly wholeResidualBasalAreaDamagePercentBounds: readonly number[];
}>;
const inputFields = [
  {
    id: "assessableResidualBasalAreaM2",
    label: "Assessable residual basal area m2",
    kind: "number",
  },
  {
    id: "damagedResidualBasalAreaM2",
    label: "Damaged residual basal area m2",
    kind: "number",
  },
  {
    id: "unassessableResidualBasalAreaM2",
    label: "Unassessable residual basal area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.assessableResidualBasalAreaM2,
    "assessableResidualBasalAreaM2",
  );
  nonnegative(input.damagedResidualBasalAreaM2, "damagedResidualBasalAreaM2");
  nonnegative(
    input.unassessableResidualBasalAreaM2,
    "unassessableResidualBasalAreaM2",
  );
  fraction(
    input.damagedResidualBasalAreaM2 / input.assessableResidualBasalAreaM2,
    "damagedResidualBasalAreaM2",
  );
  const total =
    input.assessableResidualBasalAreaM2 + input.unassessableResidualBasalAreaM2;
  return {
    observableResidualDamagePercent:
      (100 * input.damagedResidualBasalAreaM2) /
      input.assessableResidualBasalAreaM2,
    wholeResidualBasalAreaDamagePercentBounds: [
      (100 * input.damagedResidualBasalAreaM2) / total,
      (100 *
        (input.damagedResidualBasalAreaM2 +
          input.unassessableResidualBasalAreaM2)) /
        total,
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  assessableResidualBasalAreaM2: 30,
  damagedResidualBasalAreaM2: 6,
  unassessableResidualBasalAreaM2: 10,
} satisfies Input;
export const exampleOutput = {
  observableResidualDamagePercent: 20,
  wholeResidualBasalAreaDamagePercentBounds: [15, 40],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/residual-stand-damage-percent-basal-area",
  title: "Residual Stand Damage Percent Basal Area",
  description:
    "Compare caller observed damaged residual basal area with assessable residual inventory and bounds for unassessable area; no diagnosis from raw stem count or assumed health of unexamined trees.",
  inputs: inputFields,
  outputs: [
    {
      id: "observableResidualDamagePercent",
      label: "Observable residual damage percent",
      kind: "number",
    },
    {
      id: "wholeResidualBasalAreaDamagePercentBounds",
      label: "Whole residual basal area damage percent bounds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      assessableResidualBasalAreaM2:
        value.assessableResidualBasalAreaM2 as number,
      damagedResidualBasalAreaM2: value.damagedResidualBasalAreaM2 as number,
      unassessableResidualBasalAreaM2:
        value.unassessableResidualBasalAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
