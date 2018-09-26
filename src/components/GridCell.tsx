import styled from "styled-components";
import * as React from "react";

type GridCellProps = {
  isSelected: boolean;
  isActive: boolean;
  onSelectedChange: (selected: boolean) => void;
};

const StyledGridItem = styled.div`
  border: 1px solid black;
  margin: 2px;
  cursor: pointer;
  background-color: ${(props: { selected: boolean; active: boolean }) =>
    props.selected ? (props.active ? "orange" : "hotpink") : props.active ? "yellow" : "white"};
`;

export const GridCell = (props: GridCellProps) => (
  <StyledGridItem
    selected={props.isSelected}
    active={props.isActive}
    onClick={() => props.onSelectedChange(!props.isSelected)}
  />
);
