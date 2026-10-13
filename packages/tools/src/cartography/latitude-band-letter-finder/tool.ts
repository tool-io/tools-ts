import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch52-shared.js";
export type Input = Readonly<{ readonly latitudeDegrees: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  angle(i.latitudeDegrees, "latitude", -80, 84);
  const bands = "CDEFGHJKLMNPQRSTUVWX";
  return {
    utmLatitudeBand:
      bands[Math.min(19, Math.floor((i.latitudeDegrees + 80) / 8))],
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { latitudeDegrees: 0 },
  output: { result: { utmLatitudeBand: "N" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/latitude-band-letter-finder",
  title: "Latitude Band Letter from Latitude Finder",
  description:
    "UTM latitude bands C–X excluding I/O, X spans 72–84 degrees; does not compute a projection or UPS band.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { utmLatitudeBand: { type: "string" } },
        required: ["utmLatitudeBand"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
