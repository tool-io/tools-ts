import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  bounded,
  mean,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyCodedErythemaScores: readonly number[];
  readonly independentlyCodedEdemaScores: readonly number[];
  readonly actualObservationKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCodedErythemaScores",
    label: "Independently coded erythema scores",
    kind: "numberList",
  },
  {
    id: "independentlyCodedEdemaScores",
    label: "Independently coded edema scores",
    kind: "numberList",
  },
  {
    id: "actualObservationKnownFlags",
    label: "Actual observation known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyCodedErythemaScores,
    input.independentlyCodedEdemaScores,
    "observations",
  );
  aligned(
    input.independentlyCodedErythemaScores,
    input.actualObservationKnownFlags,
    "known",
  );
  binary(input.actualObservationKnownFlags, "known");
  [
    input.independentlyCodedErythemaScores,
    input.independentlyCodedEdemaScores,
  ].forEach((v) => v.forEach((x) => bounded(x, "code", 0, 4)));
  return {
    observedKnownPrimaryIrritationIndex: mean(
      input.independentlyCodedErythemaScores.flatMap((v, i) =>
        input.actualObservationKnownFlags[i]
          ? [v + input.independentlyCodedEdemaScores[i]]
          : [],
      ),
    ),
    unknownObservationIndices: input.actualObservationKnownFlags.flatMap(
      (v, i) => (v ? [] : [i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCodedErythemaScores: [1, 2],
    independentlyCodedEdemaScores: [1, 0],
    actualObservationKnownFlags: [1, 1],
  },
  output: {
    result: {
      observedKnownPrimaryIrritationIndex: 2,
      unknownObservationIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/skin-irritation-pii",
  title: "Skin Irritation PII Calculator",
  description:
    "Declared PIImean independently coded erythema+edema per actual same site/time0\u20134each. Unknowns retained; actual test protocol, averaging weights and clinical/animal interpretation external, no automatic hazard category or procedures.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
