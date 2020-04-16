import React from 'react';
import styled from 'styled-components';


const StoryBarInputLabel = styled.label`
  width: 100%;
  min-height: 50px;

  background-color: transparent;
  display: block;
  overflow: hidden;
  position: relative;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  &:before {
    transition: all 0.2s;
    content: "";
    position: absolute;
    border: 10px ${props => props.shouldBeDashed ? 'dashed #535353' : 'solid white'};
    top: -7px;
    bottom: -7px;
    left: -7px;
    right: -7px;
  }
`;

const StoryBarInput = styled.input`
  display: block;

  margin-top: auto;
  margin-bottom: auto;
  /* cursor: pointer; */
  transition: all 0.2s;
  flex-grow: 1;
  border: none;
  padding-left: 35px;
  color: ${props => props.shouldBeLighter ? '#535353' : '#9D9D9D'};
  background-color: transparent;
	overflow: hidden;
`;

const DecorativePlus = styled.span`
  transition: all 0.2s;
  margin-right: 40px;
  font-size: 40px;
  height: 100%;
  line-height: 50px;
  opacity: ${props => props.shouldDisappear ? '100' : '0'}%;
`;

export default function StoryLinkField(props) {
  return (
    <StoryBarInputLabel shouldBeDashed={props.isInitial ? false : (props.hasText ? false : !props.isLinkBeingEdited)}>
      <StoryBarInput
        placeholder={props.isInitial ? "Post a link to the story you want as a epub" : "Add another link"}
        shouldBeLighter={props.isInitial ? false : (props.hasText ? false : !props.isLinkBeingEdited)}
        onChange={props.handleLinkChange}
      />
      <DecorativePlus shouldDisappear={props.isInitial ? false : !props.isLinkBeingEdited}>+</DecorativePlus>
    </StoryBarInputLabel>
  )
}