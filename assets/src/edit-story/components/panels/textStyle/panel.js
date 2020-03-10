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
import { useCallback, useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { dataPixels } from '../../../units';
import { calculateTextHeight } from '../../../utils/textMeasurements';
import calcRotatedResizeOffset from '../../../utils/calcRotatedResizeOffset';
import removeUnsetValues from '../utils/removeUnsetValues';
import getCommonValue from '../utils/getCommonValue';
import { SimplePanel } from '../panel';
import TextStyleControls from './textStyle';
import ColorControls from './color';
import PaddingControls from './padding';
import FontControls from './font';

function StylePanel({ selectedElements, onSetProperties }) {
  const padding = getCommonValue(selectedElements, 'padding') ?? '';

  // Color settings.
  const color = getCommonValue(selectedElements, 'color');
  const backgroundColor = getCommonValue(selectedElements, 'backgroundColor');
  const backgroundOpacity = getCommonValue(
    selectedElements,
    'backgroundOpacity'
  );

  const [state, setState] = useState({
    backgroundColor,
    backgroundOpacity,
    color,
    padding,
  });
  const [lockPaddingRatio, setLockPaddingRatio] = useState(true);
  useEffect(() => {
    setState({
      backgroundColor,
      backgroundOpacity,
      color,
      padding,
    });
  }, [color, padding, backgroundColor, backgroundOpacity]);
  const handleSubmit = useCallback(
    (evt) => {
      onSetProperties(state);
      onSetProperties((properties) => {
        const {
          padding: oldPadding,
          width,
          height: oldHeight,
          rotationAngle,
          x,
          y,
        } = properties;
        const { padding: newPadding } = state;
        const updatedState = removeUnsetValues(state);
        const newProperties = { ...properties, ...updatedState };
        const newHeight = dataPixels(calculateTextHeight(newProperties, width));
        const [dx, dy] = calcRotatedResizeOffset(
          rotationAngle,
          0,
          0,
          0,
          newHeight - oldHeight
        );
        const ratio = getPaddingRatio(
          oldPadding.horizontal,
          oldPadding.vertical
        );
        if (
          lockPaddingRatio &&
          (newPadding.horizontal === '' || newPadding.vertical === '') &&
          ratio
        ) {
          if (newPadding.horizontal === '') {
            newPadding.horizontal = Math.round(
              dataPixels(newPadding.vertical * ratio)
            );
          } else {
            newPadding.horizontal = Math.round(
              dataPixels(newPadding.horizontal / ratio)
            );
          }
        }
        return {
          ...updatedState,
          height: newHeight,
          x: dataPixels(x + dx),
          y: dataPixels(y + dy),
          padding: newPadding,
        };
      });
      if (evt) {
        evt.preventDefault();
      }
    },
    [lockPaddingRatio, onSetProperties, state]
  );

  useEffect(() => {
    handleSubmit();
  }, [
    state.textAlign,
    state.bold,
    state.fontStyle,
    state.textDecoration,
    handleSubmit,
  ]);

  const getPaddingRatio = (horizontal, vertical) => {
    if (!vertical || !horizontal) {
      return false;
    }
    return horizontal / vertical;
  };

  return (
    <SimplePanel
      name="style"
      title={__('Style', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <FontControls
        selectedElements={selectedElements}
        onSetProperties={onSetProperties}
      />
      <TextStyleControls
        selectedElements={selectedElements}
        onSetProperties={onSetProperties}
      />
      <ColorControls
        state={state}
        setState={setState}
        properties={{
          backgroundColor,
          backgroundOpacity,
          color,
        }}
      />
      <PaddingControls
        getPaddingRatio={getPaddingRatio}
        properties={{ padding }}
        state={state}
        lockPaddingRatio={lockPaddingRatio}
        setLockPaddingRatio={setLockPaddingRatio}
        setState={setState}
      />
    </SimplePanel>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default StylePanel;
