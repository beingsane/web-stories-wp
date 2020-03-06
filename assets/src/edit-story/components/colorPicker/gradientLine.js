/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import generatePatternStyles from '../../utils/generatePatternStyles';
import { ColorStopPropType } from '../../types';
import Pointer from './pointer';
import GradientStop from './gradientStop';
import useKeyMoveStop from './useKeyMoveStop';
import useKeyAddStop from './useKeyAddStop';
import useKeyDeleteStop from './useKeyDeleteStop';
import useKeyFocus from './useKeyFocus';
import { LINE_LENGTH, LINE_WIDTH } from './constants';

const LINE_FULL_LENGTH = LINE_LENGTH + LINE_WIDTH;

const Line = styled.div.attrs(({ stops }) => ({
  tabIndex: -1,
  style: generatePatternStyles({
    type: 'linear',
    // "Push" the ends of the gradient in, so it starts and
    // ends at (LINE_WIDTH / 2) px
    stops: stops.map(({ color, position }) => ({
      color,
      position: (position * LINE_LENGTH + LINE_WIDTH / 2) / LINE_FULL_LENGTH,
    })),
    // And fix rotation to .75 to make it go left-to-right
    rotation: 0.75,
  }),
}))`
  width: ${LINE_FULL_LENGTH}px;
  height: ${LINE_WIDTH}px;
  border-radius: ${LINE_WIDTH / 2}px;
  position: relative;

  &:focus {
    /* The line will only have temporary focus while deleting stops */
    outline: none;
  }
`;

function GradientPicker({
  stops,
  currentStopIndex,

  onSelect,
  onAdd,
  onDelete,
  onMove,
}) {
  const line = useRef();

  useKeyMoveStop(line, onMove, stops, currentStopIndex);
  useKeyAddStop(line, onAdd, stops, currentStopIndex);
  useKeyDeleteStop(line, onDelete);
  const stopRefs = useKeyFocus(line, stops, currentStopIndex);

  return (
    <Line stops={stops} ref={line}>
      {stops.map(({ position }, index) => (
        <GradientStop
          ref={(ref) => (stopRefs[index].current = ref)}
          key={index}
          index={index}
          isSelected={index === currentStopIndex}
          position={position}
          onSelect={onSelect}
          onAdd={onAdd}
          onDelete={onDelete}
          onMove={onMove}
        >
          <Pointer offset={-6} />
        </GradientStop>
      ))}
    </Line>
  );
}

GradientPicker.propTypes = {
  stops: PropTypes.arrayOf(ColorStopPropType),
  currentStopIndex: PropTypes.number.isRequired,

  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
};

export default GradientPicker;
