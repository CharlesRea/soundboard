import styled from "styled-components";
import { GridCell } from "./GridCell";
import * as React from "react";
import { times } from 'lodash';

export type GridSelectionState = { [x: number]: { [y: number]: { isSelected: boolean } } };
type GridSelectorProps = {
  rows: number;
  columns: number;
  selectedItemState: GridSelectionState;
  onSelectionChange: (row: number, column: number, selected: boolean) => void;
  activeColumn: number | null;
};

const GridSelectorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props: { numberColumns: number }) => props.numberColumns}, 50px);
  grid-auto-rows: 50px;
`;

export const GridSelector = (props: GridSelectorProps) => (
  <GridSelectorContainer numberColumns={props.columns}>
    {times(props.rows, row =>
      times(props.columns, column => (
        <GridCell
          key={`row: ${row} column:  ${column}`}
          isSelected={props.selectedItemState[row][column].isSelected}
          isActive={props.activeColumn === column}
          onSelectedChange={(isSelected) => props.onSelectionChange(row, column, isSelected)}
        />
      ))
    )}
  </GridSelectorContainer>
);
