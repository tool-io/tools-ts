import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly utmZone: number;
  readonly squareLetters: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "utmZone", label: "Utm zone", kind: "number" },
  { id: "squareLetters", label: "Square letters", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.utmZone, "zone", 1, 60);
  if (!/^[A-Z]{2}$(?![\s\S])/.test(i.squareLetters))
    simpleError("square", "Two uppercase letters.");
  const columns = ["ABCDEFGH", "JKLMNPQR", "STUVWXYZ"][(i.utmZone - 1) % 3],
    rows = "ABCDEFGHJKLMNPQRSTUV";
  return {
    validUtmSquareLetterInventory:
      columns.includes(i.squareLetters[0]) && rows.includes(i.squareLetters[1]),
    fullMgrsPositionValidated: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { utmZone: 1, squareLetters: "AA" },
  output: {
    result: {
      validUtmSquareLetterInventory: true,
      fullMgrsPositionValidated: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/mgrs-square-letter-validator",
  title: "MGRS 100km Square Letter Pair Validator",
  description:
    "UTM MGRS 100km square letter inventory by zone set only; northing cycle, latitude-band intersection and UPS excluded.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
