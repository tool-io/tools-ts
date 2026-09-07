import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSeebeckVoltsKelvin: readonly number[];
  readonly observedJunctionKelvin: readonly number[];
}>;
export type Output = Readonly<{
  readonly kelvinRelationPeltierVolts: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSeebeckVoltsKelvin",
    label: "Observed seebeck volts kelvin",
    kind: "numberList",
  },
  {
    id: "observedJunctionKelvin",
    label: "Observed junction kelvin",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedJunctionKelvin.forEach((v) =>
    positive(v, "observedJunctionKelvin"),
  );
  aligned(
    input.observedSeebeckVoltsKelvin,
    input.observedJunctionKelvin,
    "observedSeebeckVoltsKelvin",
  );
  return {
    kelvinRelationPeltierVolts: input.observedSeebeckVoltsKelvin.map(
      (v, i) => v * input.observedJunctionKelvin[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSeebeckVoltsKelvin: [0.01, -0.02],
  observedJunctionKelvin: [300, 400],
} satisfies Input;
export const exampleOutput = {
  kelvinRelationPeltierVolts: [3, -8],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/thermoelectric-peltier-coefficient",
  title: "Semiconductor Thermoelectric Peltier Coefficient Calculator",
  description:
    "Apply Kelvin Π=S T to matched signed Seebeck/absolute-temperature observations, not voltage/temperature Seebeck extraction or ZT; no temperature-control hardware advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "kelvinRelationPeltierVolts",
      label: "Kelvin relation peltier volts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSeebeckVoltsKelvin:
        value.observedSeebeckVoltsKelvin as readonly number[],
      observedJunctionKelvin: value.observedJunctionKelvin as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
