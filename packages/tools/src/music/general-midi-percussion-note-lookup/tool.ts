import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly noteNumber: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "noteNumber", label: "Note number", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.noteNumber,
      {
        "35": "Acoustic Bass Drum",
        "36": "Bass Drum 1",
        "37": "Side Stick",
        "38": "Acoustic Snare",
        "39": "Hand Clap",
        "40": "Electric Snare",
        "41": "Low Floor Tom",
        "42": "Closed Hi-Hat",
        "43": "High Floor Tom",
        "44": "Pedal Hi-Hat",
        "45": "Low Tom",
        "46": "Open Hi-Hat",
        "47": "Low-Mid Tom",
        "48": "Hi-Mid Tom",
        "49": "Crash Cymbal 1",
        "50": "High Tom",
        "51": "Ride Cymbal 1",
        "52": "Chinese Cymbal",
        "53": "Ride Bell",
        "54": "Tambourine",
        "55": "Splash Cymbal",
        "56": "Cowbell",
        "57": "Crash Cymbal 2",
        "58": "Vibraslap",
        "59": "Ride Cymbal 2",
        "60": "Hi Bongo",
        "61": "Low Bongo",
        "62": "Mute Hi Conga",
        "63": "Open Hi Conga",
        "64": "Low Conga",
        "65": "High Timbale",
        "66": "Low Timbale",
        "67": "High Agogo",
        "68": "Low Agogo",
        "69": "Cabasa",
        "70": "Maracas",
        "71": "Short Whistle",
        "72": "Long Whistle",
        "73": "Short Guiro",
        "74": "Long Guiro",
        "75": "Claves",
        "76": "Hi Wood Block",
        "77": "Low Wood Block",
        "78": "Mute Cuica",
        "79": "Open Cuica",
        "80": "Mute Triangle",
        "81": "Open Triangle",
      },
      "noteNumber",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { noteNumber: "35" },
  output: { result: { reference: "Acoustic Bass Drum" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/general-midi-percussion-note-lookup",
  title: "General MIDI Percussion Note Lookup",
  description:
    "General MIDI level 1 percussion note 35–81 names on the percussion channel; patch variants excluded.",
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
