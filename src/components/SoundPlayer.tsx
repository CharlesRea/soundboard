import * as React from "react";
import { Button, Icon } from "semantic-ui-react";
import Tone from "tone";
import { range, map, flatMap } from "lodash";
import produce from "immer";
import { GridSelectionState, GridSelector } from "./GridSelector";
const ghystonAudio = require("../sounds/ghyston.mp3");
import { mapToObject } from "../utils/mapToObject";

const player = new Tone.Player(ghystonAudio).toMaster();
player.loop = true;

const synth = new Tone.PolySynth(4, Tone.Synth).toMaster();

const allNotes = ["A4", "B4", "C4", "D4", "E4"];
const numberOfColumns = 16;
const columns = range(numberOfColumns);

type SoundPlayerState = {
  playing: boolean;
  noteSelectionState: GridSelectionState;
  currentColumnPlaying: number | null;
};

const initialSelectionState: GridSelectionState = mapToObject(range(allNotes.length), row =>
  mapToObject(columns, column => false)
);

const getSelectedNotes = (noteState: GridSelectionState): Array<{ note: string; column: number }> => {
  const mapColumn = (
    row: number,
    columnState: { [column: number]: boolean }
  ): Array<{ note: string; column: number; selected: boolean }> =>
    map<{ [column: number]: boolean }, { note: string; column: number; selected: boolean }>(
      columnState,
      (selected: boolean, column: string): { note: string; column: number; selected: boolean } => ({
        column: Number(column),
        note: allNotes[row],
        selected
      })
    );

  const flattenedState = flatMap<GridSelectionState, { note: string; column: number; selected: boolean }>(
    noteState,
    (
      columnState: { [column: number]: boolean },
      row: string
    ): Array<{ note: string; column: number; selected: boolean }> => mapColumn(Number(row), columnState)
  );

  return flattenedState.filter(state => state.selected).map(state => ({ note: state.note, column: state.column }));
};

const scheduleActionForColumn = (column: number, callback: () => void) => {
  const quarterNote = column % 4;
  const measure = Math.floor(column / 4);
  Tone.Transport.scheduleRepeat(
    callback,
    `${Math.floor(numberOfColumns / 4)}:${numberOfColumns % 4}:0`,
    `${measure}:${quarterNote}:0`
  );
};

export class SoundPlayer extends React.Component<{}, SoundPlayerState> {
  state = { playing: false, noteSelectionState: initialSelectionState, currentColumnPlaying: null };

  startPlaying = () => {
    const selectedNotes = getSelectedNotes(this.state.noteSelectionState);
    selectedNotes.forEach(({ note, column }) =>
      scheduleActionForColumn(column, () => synth.triggerAttackRelease(note, "8n"))
    );
    columns.forEach(column => scheduleActionForColumn(column, () => this.setState({ currentColumnPlaying: column })));
    Tone.Transport.start();
    this.setState({ playing: true });
  };

  toggleSoundPlaying = () => {
    if (!this.state.playing) {
      this.startPlaying();
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      this.setState({ playing: false, currentColumnPlaying: null });
    }
  };

  onSelectedNoteChange = (x: number, y: number, isSelected: boolean) => {
    this.setState(
      produce<SoundPlayerState>((draft: SoundPlayerState) => {
        draft.noteSelectionState[x][y] = isSelected;
      })
    );
  };

  render() {
    return (
      <>
        <Button onClick={this.toggleSoundPlaying}>
          <Icon name={this.state.playing ? "pause" : "play"} />
        </Button>
        <GridSelector
          rows={allNotes.length}
          columns={numberOfColumns}
          onSelectionChange={this.onSelectedNoteChange}
          selectedItemState={this.state.noteSelectionState}
          activeColumn={this.state.currentColumnPlaying}
        />
      </>
    );
  }
}
