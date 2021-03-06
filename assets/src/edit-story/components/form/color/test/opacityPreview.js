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
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../../theme';
import OpacityPreview from '../opacityPreview';
import getPreviewOpacityMock from '../getPreviewOpacity';
import getPreviewTextMock from '../getPreviewText';

jest.mock('../getPreviewOpacity', () => jest.fn());
jest.mock('../getPreviewText', () => jest.fn());

function arrange() {
  const { queryByLabelText } = render(
    <ThemeProvider theme={theme}>
      <OpacityPreview onChange={() => {}} />
    </ThemeProvider>
  );
  return queryByLabelText('Opacity');
}

describe('<OpacityPreview />', () => {
  beforeEach(() => {
    getPreviewOpacityMock.mockReset();
    getPreviewTextMock.mockReset();

    getPreviewOpacityMock.mockImplementation(() => 100);
    getPreviewTextMock.mockImplementation(() => 'FF0000');
  });

  it('should render correct opacity when there is a text', () => {
    const element = arrange();

    expect(element).toBeDefined();
    expect(element).toHaveValue('100%');
  });

  it('should be hidden when no text', () => {
    getPreviewTextMock.mockImplementation(() => null);

    const element = arrange();
    expect(element).toHaveStyle('visibility: hidden');
  });
});
