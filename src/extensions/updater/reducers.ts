import { IReducerSpec } from '../../types/IExtensionContext';

import { setUpdateChannel } from './actions';

import update = require('react-addons-update');

/**
 * reducer for changes to interface settings
 */
const settingsReducer: IReducerSpec = {
  reducers: {
    [setUpdateChannel]: (state, payload) => update(state, { channel: { $set: payload } }),
  },
  defaults: {
    channel: 'stable',
  },
};

export default settingsReducer;