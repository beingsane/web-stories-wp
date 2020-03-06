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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { ColorStopPropType } from '../../types';
import { ReactComponent as Reverse } from '../../icons/gradient_reverser.svg';
import { ReactComponent as Rotate } from '../../icons/gradient_rotator.svg';
import GradientLine from './gradientLine';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: -3px;
`;

const Button = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  display: flex;
  color: white;

  svg {
    width: 16px;
    height: 16px;
  }
`;

function GradientPicker({
  stops,
  currentStopIndex,

  onSelect,
  onAdd,
  onDelete,
  onMove,

  onRotate,
  onReverse,
}) {
  return (
    <Wrapper>
      <GradientLine
        stops={stops}
        currentStopIndex={currentStopIndex}
        onSelect={onSelect}
        onAdd={onAdd}
        onDelete={onDelete}
        onMove={onMove}
      />
      <Button onClick={onReverse}>
        <Reverse />
      </Button>
      <Button onClick={onRotate}>
        <Rotate />
      </Button>
    </Wrapper>
  );
}

GradientPicker.propTypes = {
  stops: PropTypes.arrayOf(ColorStopPropType),
  currentStopIndex: PropTypes.number.isRequired,

  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,

  onReverse: PropTypes.func.isRequired,
  onRotate: PropTypes.func.isRequired,
};

export default GradientPicker;
